frappe.ui.form.on('Patient Encounter', {
    refresh: function (frm) {
        frm.add_custom_button(__('Rehabilitation'), function () {
            let dialog = new frappe.ui.Dialog({
                title: 'Add New Rehabilitation',
                fields: [
                    {
                        label: 'Therapy Type',
                        fieldname: 'therapy',
                        fieldtype: 'Link',
                        options: 'Therapy Type',
                        reqd: 1
                    },
                    {
                        label: 'No of Sessions',
                        fieldname: 'sessions',
                        fieldtype: 'Data'
                    },
                    {
                        fieldtype: 'Section Break'
                    },
                    {
                        label: 'Patient Care Type',
                        fieldname: 'patient_care_type',
                        fieldtype: 'Link',
                        options: 'Patient Care Type',
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
                        options: 'Code Value',
                        get_query: function () {
                            return {
                                filters: {
                                    'code_system': 'Priority'
                                }
                            };
                        }
                    }
                ],
                primary_action_label: 'Add Rehabilitation',
                primary_action(values) {
                    if (values) {
                        let new_row = frm.add_child('rehabilitation');
                        new_row.therapy_type = values.therapy;
                        new_row.no_of_sessions = values.sessions;
                        new_row.patient_care_type = values.patient_care_type;
                        new_row.intent = values.intent;
                        new_row.priority = values.priority
                        frm.refresh_field('rehabilitation');
                        frappe.msgprint(__('Rehabilitation added successfully.'));
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
