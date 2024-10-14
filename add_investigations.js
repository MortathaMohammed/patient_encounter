frappe.ui.form.on('Patient Encounter', {
    refresh: function (frm) {
        frm.add_custom_button(__('Investigation'), function () {
            let dialog = new frappe.ui.Dialog({
                title: 'Add New Investigation',
                fields: [
                    {
                        label: 'Lab Test',
                        fieldname: 'lab_test_code',
                        fieldtype: 'Link',
                        options: 'Lab Test Template',
                        reqd: 1
                    },
                    {
                        label: 'Observation',
                        fieldname: 'observation_template',
                        fieldtype: 'Link',
                        options: 'Observation Template',
                        reqd: 1
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
                        options: 'Patient Care Type',
                        reqd: 1
                    },
                    {
                        label: 'Intent',
                        fieldname: 'intent',
                        fieldtype: 'Link',
                        options: 'Code Value',
                        get_query: function () {
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
                        get_query: function () {
                            return {
                                filters: {
                                    'code_system': 'Priority'
                                }
                            };
                        }
                    },
                    {
                        fieldtype: 'Section Break'
                    },
                    {
                        label: 'Comments',
                        fieldname: 'lab_test_comment',
                        fieldtype: 'Small Text'
                    }
                ],
                primary_action_label: 'Add Investigation',
                primary_action(values) {
                    if (values) {
                        let new_row = frm.add_child('lab_test_prescription');
                        new_row.lab_test_code = values.lab_test_code;
                        new_row.observation_template = values.observation_template;
                        new_row.invoiced = values.invoiced;
                        new_row.lab_test_comment = values.lab_test_comment;
                        new_row.patient_care_type = values.patient_care_type;
                        new_row.intent = values.intent;
                        new_row.priority = values.priority;

                        frm.refresh_field('lab_test_prescription');
                        frappe.msgprint(__('Investigation added successfully.'));
                        dialog.clear();
                    } else {
                        frappe.msgprint(__('Please fill in all the required fields.'));
                    }
                },
                secondary_action_label: 'Close',
                secondary_action: function () {
                    dialog.hide();
                }
            });

            dialog.show();
        });
    }
});
