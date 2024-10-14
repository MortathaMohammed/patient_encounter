frappe.ui.form.on('Patient Encounter', {
    refresh: function (frm) {
        frm.add_custom_button(__('Medication'), function () {
            let dialog = new frappe.ui.Dialog({
                title: 'Add New Medication',
                fields: [
                    {
                        label: 'Medication',
                        fieldname: 'medication',
                        fieldtype: 'Link',
                        options: 'Medication',
                        reqd: 1,
                        change: function () {
                            let medication_name = dialog.get_value('medication');
                            if (medication_name) {
                                frappe.db.get_doc('Medication', medication_name)
                                    .then(medication => {
                                        if (medication) {
                                            dialog.set_value('strength', medication.strength || '');
                                            dialog.set_value('strength_uom', medication.strength_uom || '');
                                            dialog.set_value('dosage_form', medication.dosage_form || '');
                                            dialog.set_value('dosage', medication.default_prescription_dosage || '');
                                            dialog.set_value('period', medication.default_prescription_duration || '');
                                        }
                                    });
                            }
                        }
                    },
                    {
                        label: 'Drug Code',
                        fieldname: 'drug_code',
                        fieldtype: 'Link',
                        options: 'Item',
                        get_query: function () {
                            let medication_value = dialog.get_value('medication');

                            return {
                                filters: {
                                    'is_stock_item': 'Yes'
                                }
                            };
                        },
                        reqd: 1
                    },
                    {
                        label: 'Strength',
                        fieldname: 'strength',
                        fieldtype: 'Data'
                    },
                    {
                        label: 'Strength UOM',
                        fieldname: 'strength_uom',
                        fieldtype: 'Data'
                    },
                    {
                        label: 'Dosage Form',
                        fieldname: 'dosage_form',
                        fieldtype: 'Link',
                        options: 'Dosage Form',
                        reqd: 1
                    },
                    {
                        fieldtype: 'Column Break'
                    },
                    {
                        label: 'Dosage',
                        fieldname: 'dosage',
                        fieldtype: 'Link',
                        options: 'Prescription Dosage',
                        reqd: 1
                    },
                    {
                        label: 'Period',
                        fieldname: 'period',
                        fieldtype: 'Link',
                        options: 'Prescription Duration',
                        reqd: 1
                    },
                    {
                        label: 'Number Of Repeats Allowed',
                        fieldname: 'number_of_repeats_allowed',
                        fieldtype: 'Int'
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
                    },
                    {
                        fieldtype: 'Column Break'
                    },
                    {
                        label: 'Comment',
                        fieldname: 'comment',
                        fieldtype: 'Small Text'
                    }
                ],
                primary_action_label: 'Add Medication',
                primary_action(values) {
                    if (values) {

                        let new_row = frm.add_child('drug_prescription');
                        new_row.medication = values.medication;
                        new_row.drug_code = values.drug_code;
                        new_row.strength = values.strength;
                        new_row.strength_uom = values.strength_uom;
                        new_row.dosage_form = values.dosage_form;
                        new_row.dosage = values.dosage;
                        new_row.period = values.period;
                        new_row.number_of_repeats_allowed = values.number_of_repeats_allowed;
                        new_row.intent = values.intent;
                        new_row.priority = values.priority;
                        new_row.comment = values.comment;
                        frm.refresh_field('drug_prescription');
                        frappe.msgprint(__('Medication added successfully.'));
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
