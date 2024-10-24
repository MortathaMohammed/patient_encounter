
# Custom Service Creation in Patient Encounter

This custom feature automates the creation of **Medication Requests**, **Lab Tests**, and **Clinical Procedures** based on entries in the Patient Encounter's child tables. It ensures that services are only created for new entries that have not yet been linked to an existing service. Duplicate checks are performed to avoid creating redundant services.

## Features

### 1. Automatic Service Creation
After the user enters details in the Patient Encounter form and saves it, the system will automatically generate any missing services (such as Medication Requests or Lab Tests) for the patient. The system processes any unlinked entries from the child tables and creates the required services.

### 2. Manual Service Entry via Custom Buttons
Custom buttons such as **Procedures**, **Rehabilitation**, and **Investigations** are available on the Patient Encounter form, allowing manual addition of services. Each button opens a dialog where the user can enter details like procedure name, department, practitioner, etc. Once the required details are entered, the service is added and saved to the patient's encounter record.

### 3. Duplicate Service Check
Before saving the form, the system checks whether services (like medications, lab tests, or procedures) already exist for the patient. If duplicates are found, the user is prompted with a confirmation message, asking if they wish to proceed with creating the duplicate service.

## Code Breakdown

### 1. `create_services(doc, method)`
This function triggers after the Patient Encounter is saved. It processes the child tables (`drug_prescription`, `lab_test_prescription`, and `procedure_prescription`) and creates services accordingly.

### 2. Processing Functions
- `process_medications(doc, errors)`: Handles creating **Medication Requests** from the `drug_prescription` child table.
- `process_lab_tests(doc, errors)`: Creates **Lab Tests** from the `lab_test_prescription` child table.
- `process_procedures(doc, errors)`: Generates **Clinical Procedures** from the `procedure_prescription` child table.

### 3. `create_service_request_for_service(doc, service_doctype, service_name)`
This helper function creates a **Service Request** for the newly created service (such as a Medication Request or Lab Test). The service request is linked to the original encounter.

### 4. `check_duplicate_services(patient, services)`
This function checks if any of the services (medications, lab tests, or procedures) already exist for the patient, preventing redundant services from being created.

## File Structure
- `custom_app/custom_app/patient_encounter_handler.py`: Contains the logic for service creation and duplicate checking.
- `custom_app/public/js/patient_encounter.js`: Client-side logic for handling button actions and dialogs.

## Example Usage

```python
frappe.ui.form.on('Patient Encounter', {
    refresh: function(frm) {
        frm.add_custom_button(__('Procedures'), function() {
            let dialog = new frappe.ui.Dialog({
                title: 'Add New Procedure',
                fields: [
                    {
                      label: 'Clinical Procedure',
                      fieldname: 'procedure',
                      fieldtype: 'Link',
                      options: 'Clinical Procedure Template',
                      reqd: 1
                    },
                    {
                      label: 'Procedure Name',
                      fieldname: 'procedure_name',
                      fieldtype: 'Data'
                    },
                    {
                      label: 'Department',
                      fieldname: 'department',
                      fieldtype: 'Link',
                      options: 'Medical Department'
                    }
                ],
                primary_action_label: 'Add Procedure',
                primary_action(values) {
                    let new_row = frm.add_child('procedure_prescription');
                    new_row.procedure = values.procedure;
                    new_row.procedure_name = values.procedure_name;
                    new_row.department = values.department;
                    frm.refresh_field('procedure_prescription');
                    frappe.msgprint(__('Procedure added successfully.'));
                    dialog.clear();
                }
            });
            dialog.show();
        });
    }
});
```

## License
MIT License
