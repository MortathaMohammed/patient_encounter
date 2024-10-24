Documentation for Custom Service Creation in Patient Encounter
Overview

This custom Frappe app feature automates the creation of medical services such as Medication Requests, Lab Tests, and Clinical Procedures based on entries in the Patient Encounter DocType. The feature ensures that services are created only for new entries that haven't been linked to existing services. It also provides checks to avoid creating duplicate services.
Code Flow

    Main Trigger:
        The function create_services(doc, method=None) is triggered after saving the Patient Encounter. It checks for entries in the child tables: drug_prescription, lab_test_prescription, and procedure_prescription, and creates services accordingly.

    Service Creation Functions:
        process_medications(): Iterates through the drug_prescription child table to create Medication Requests.
        process_lab_tests(): Iterates through the lab_test_prescription child table to create Lab Tests.
        process_procedures(): Iterates through the procedure_prescription child table to create Clinical Procedures.
        Each service is inserted using frappe.get_doc() and linked back to the child table via the custom_linked_document field.

    Duplicate Service Check:
        The method check_duplicate_services(patient, services) verifies if the service already exists for the patient. It prevents redundant creation by checking existing records in Medication Request, Lab Test, and Clinical Procedure DocTypes.

    Dialog Setup for Manual Entry:
        Custom buttons like Procedures, Rehabilitation, Investigation, etc., are added to the Patient Encounter form, allowing users to manually add services via dialogs.
        Each dialog collects inputs, adds a new entry to the relevant child table (e.g., procedure_prescription), and saves the form.

    Client-Side Validations:
        The system checks for new services that have not been linked before saving. If duplicates are found, the user is prompted to confirm whether to proceed with creating those services again.

Files and Code Locations

    custom_app/custom_app/patient_encounter_handler.py: Contains the logic for creating services and duplicate checking.
    custom_app/public/js/patient_encounter.js: Defines the client-side logic and dialog setups.
