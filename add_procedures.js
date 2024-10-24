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
                      change: function() {
                          
                            let procedure_name = dialog.get_value('procedure');
                            if (procedure_name) {
                               
                                frappe.db.get_doc('Clinical Procedure Template', procedure_name)
                                    .then(procedure => {
                                        if (procedure) {
                                            dialog.set_value('procedure_name', procedure.template || '');
                                            dialog.set_value('department', procedure.medical_department || '');
                                        }
                                    });
                            }
                        },
                      reqd: 1
                    },
                    {
                      label: 'Procedure Name',
                      fieldname: 'procedure_name',
                      fieldtype: 'Data',
                    },
                    {
                      label: 'Department',
                      fieldname: 'department',
                      fieldtype: 'Link',
                      options: 'Medical Department'
                    },
                    {
                        label: 'Referring Practitioner',
                        fieldname: 'practitioner',
                        fieldtype: 'Link',
                        options: 'Healthcare Practitioner'
                    },
                    {
                        fieldtype: 'Column Break'
                    },
                    {
                        label: 'Date',
                        fieldname: 'date',
                        fieldtype: 'Date'
                    },
                    {
                        label: 'Comments',
                        fieldname: 'comment',
                        fieldtype: 'Data'
                    },
                    {
                        label: 'Invoiced',
                        fieldname: 'invoiced',
                        fieldtype: 'Check'
                    },
                    {
                        fieldtype: 'Section Break'
                    },
                    {
                        label: 'Patient Care Type',
                        fieldname: 'patient_care_type',
                        fieldtype: 'Link',
                        options: 'Patient Care Type'
                    },
                    {
                        label: 'Intent',
                        fieldname: 'intent',
                        fieldtype: 'Link',
                        options: 'Code Value',
                        get_query: function() {
                            return {
                                filters: {
                                    'code_system': 'Intent'
                                }
                            };
                        }
                    },
                    {
                        label: 'Priority',
                        fieldname: 'priority',
                        fieldtype: 'Link',
                        options: "Code Value",
                        get_query: function() {
                            return {
                                filters: {
                                    'code_system': 'Priority'
                                }
                            };
                        }
                    }
                ],
                primary_action_label: 'Add Procedure',
                primary_action(values) {
                    if (values) {
                        
                        let new_row = frm.add_child('procedure_prescription');
                        new_row.procedure = values.procedure;
                        new_row.procedure_name = values.procedure_name;
                        new_row.department = values.department;
                        new_row.practitioner = values.practitioner;
                        new_row.date = values.date;
                        new_row.comments = values.comments;
                        new_row.invoiced = values.invoiced;
                        new_row.patient_care_type = values.patient_care_type;
                        new_row.intent = values.intent;
                        new_row.priority = values.priority;
                        frm.refresh_field('procedure_prescription');
                        frappe.msgprint(__('Procedure added successfully.'));
                        dialog.clear();
                    } else {
                        frappe.msgprint(__('Please fill in all the required fields.'));
                    }
                    
                    
                },
                secondary_action_label: 'Save & Close',
                secondary_action: function() {
                    // Save the form and close the dialog
                    frm.save().then(() => {
                        frappe.msgprint(__('Document saved successfully.'));
                        dialog.hide(); // Close the dialog after saving
                    }).catch(error => {
                        frappe.msgprint(__('Error while saving the document.'));
                    });
                }
            });
            dialog.show();
        });
    }
});
