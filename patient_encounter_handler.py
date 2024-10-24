import frappe
import json
from frappe import _

def create_services(doc, method=None):
    """
    Creates services (Medication Request, Lab Test, Clinical Procedure) based on new entries
    in the Inpatient Record's child tables. Only processes entries that have not yet been linked
    to a created service (i.e., where 'custom_linked_document' is not set).
    This function is triggered after the Patient Encounter is saved, but only if the patient is admitted.
    """
    frappe.logger().info(f"Starting service creation for Patient Encounter: {doc.name}")

    errors = []
    service_created = False  

    if process_medications(doc, errors):
        service_created = True
    if process_lab_tests(doc, errors):
        service_created = True
    if process_procedures(doc, errors):
        service_created = True

    if errors:
        error_messages = "\n".join(errors)
        frappe.msgprint(
            _("Errors occurred while creating services:\n{0}").format(error_messages),
            title=_("Service Creation Errors"),
            indicator="red"
        )
    elif service_created:
        frappe.msgprint(
            _("Services have been successfully created and corresponding Service Requests have been generated."),
            title=_("Service Creation"),
            indicator="green"
        )

def process_medications(doc, errors):
    service_created = False  
    if hasattr(doc, 'drug_prescription'):
        for medication in doc.drug_prescription:
       
            if not medication.custom_linked_document:
                try:
                    medication_name = medication.medication
                    medication_code = medication.drug_code
                    dosage_form = medication.dosage_form
                    dosage = medication.dosage

                    new_medication = frappe.get_doc({
                        "doctype": "Medication Request",
                        "patient": doc.patient,
                        "inpatient_record": doc.name,
                        "medication" : medication_name,
                        "medication_item": medication_code,
                        "practitioner": doc.practitioner,
                        "dosage_form": dosage_form,
                        "dosage": dosage,
                    })
                    new_medication.insert(ignore_permissions=True)
                    frappe.logger().info(
                        f"Medication Request '{new_medication.name}' created for medication '{medication_name}'"
                    )

                    medication.custom_linked_document = new_medication.name
                    medication.db_update()

                    service_created = True 

                except Exception as e:
                    frappe.log_error(frappe.get_traceback(), _("Error creating Medication Request"))
                    errors.append(f"Medication '{medication_name}': {str(e)}")
            else:
                frappe.logger().debug(
                    f"Medication '{medication.drug_name}' already linked to {medication.custom_linked_document}"
                )
    return service_created

def process_lab_tests(doc, errors):
    service_created = False  
    if hasattr(doc, 'lab_test_prescription'):
        for lab_test in doc.lab_test_prescription:
            if not lab_test.custom_linked_document:
                try:
                    lab_test_code = lab_test.lab_test_code
                    
                    new_lab_test = frappe.get_doc({
                        "doctype": "Lab Test",
                        "patient": doc.patient,
                        "inpatient_record": doc.name,
                        "template": lab_test_code,
                        "patient_sex": doc.patient_sex,
                        "practitioner": doc.practitioner,
                        "status": "Draft"
                    })
                    new_lab_test.insert(ignore_permissions=True)

                    lab_test.custom_linked_document = new_lab_test.name
                    lab_test.db_update()

                    frappe.logger().info(
                        f"Lab Test '{new_lab_test.name}' created for template '{lab_test_code}'"
                    )

                    create_service_request_for_service(
                        doc=doc,
                        service_doctype="Lab Test",
                        service_name=new_lab_test.name,
                    )

                    service_created = True 

                except Exception as e:
                    frappe.log_error(frappe.get_traceback(), _("Error creating Lab Test"))
                    errors.append(f"Lab Test '{lab_test_code}': {str(e)}")
            else:
                frappe.logger().debug(
                    f"Lab Test '{lab_test.lab_test_code}' already linked to {lab_test.custom_linked_document}"
                )
    return service_created

def process_procedures(doc, errors):
    service_created = False  
    if hasattr(doc, 'procedure_prescription'):
        for procedure in doc.procedure_prescription:
            if not procedure.custom_linked_document:
                try:
                    procedure_name = procedure.procedure_name

                    new_procedure = frappe.get_doc({
                        "doctype": "Clinical Procedure",
                        "patient": doc.patient,
                        "inpatient_record": doc.name,
                        "procedure_template": procedure_name,
                        "practitioner": doc.practitioner,
                        "status": "Draft"
                    })
                    new_procedure.insert(ignore_permissions=True)

                    procedure.custom_linked_document = new_procedure.name
                    procedure.db_update()

                    frappe.logger().info(
                        f"Clinical Procedure '{new_procedure.name}' created for procedure '{procedure_name}'"
                    )

                    create_service_request_for_service(
                        doc=doc,
                        service_doctype="Clinical Procedure",
                        service_name=new_procedure.name,
                    )

                    service_created = True 

                except Exception as e:
                    frappe.log_error(frappe.get_traceback(), _("Error creating Clinical Procedure"))
                    errors.append(f"Procedure '{procedure_name}': {str(e)}")
            else:
                frappe.logger().debug(
                    f"Procedure '{procedure.procedure_name}' already linked to {procedure.custom_linked_document}"
                )
    return service_created

def create_service_request_for_service(doc, service_doctype, service_name, service_type=None):
    try:
        from datetime import datetime
        now = datetime.now()
        order_date = now.date()
        order_time = now.time().strftime("%H:%M:%S")

        status_code_value = frappe.get_value("Code Value", {"code_value": "Draft"}, "name")
        if not status_code_value:
            frappe.throw(_("Could not find a valid status with code value 'Draft'."))

        service_request = frappe.get_doc({
            "doctype": "Service Request",
            "naming_series": "HSR-",
            "order_date": order_date,
            "order_time": order_time,
            "status": status_code_value, 
            "company": doc.company or frappe.defaults.get_user_default("Company"),
            "patient": doc.patient,
            "practitioner": doc.practitioner,
            "template_dt": service_doctype,
            "template_dn": service_name,
            "source_doc": doc.doctype,
            "patient_care_type": "Diagnostic",
            "occurrence_date": order_date
        })

        service_request.insert(ignore_permissions=True)
        service_request.save()
        service_request.submit()
        frappe.logger().info(
            f"Service Request '{service_request.name}' created for {service_doctype} '{service_name}'"
        )

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), _("Error creating Service Request"))
        frappe.throw(_("An error occurred while creating the Service Request for {0}: {1}").format(service_name, str(e)))

@frappe.whitelist()
def check_duplicate_services(patient, services):
    duplicates = []
    if isinstance(services, str):
        services = json.loads(services)
    
    for service in services:
        service_type = service.get('service_type')
        service_name = service.get('service_name')

        if service_type == 'Medication':
            existing = frappe.get_all('Medication Request', filters={
                'patient': patient,
                'medication_item': service_name,
                'docstatus': ['<', 2]
            }, limit=1)
        elif service_type == 'Lab Test':
            existing = frappe.get_all('Lab Test', filters={
                'patient': patient,
                'template': service_name,
                'docstatus': ['<', 2]
            }, limit=1)
        elif service_type == 'Procedure':
            existing = frappe.get_all('Clinical Procedure', filters={
                'patient': patient,
                'procedure_template': service_name,
                'docstatus': ['<', 2]
            }, limit=1)
        else:
            existing = []
    
        if existing:
            duplicates.append({
                'service_type': service_type,
                'service_name': service_name
            })
    
    return duplicates