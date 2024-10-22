frappe.ui.form.on('Patient Encounter', {
    setup: function (frm) {
        console.log("Form setup called. Adding Patient History button.");

        if (!frm.custom_patient_history_button_added) {
            console.log("Adding Patient History button.");

            let tabWrapper = $(".form-tabs");
            if (tabWrapper.length) {
                let patientHistoryButton = `
                    <button class="btn btn-secondary btn-xs" id="patient-history-btn" style="margin: 5px;">
                        Patient History
                    </button>
                `;
                tabWrapper.append(patientHistoryButton);

                $("#patient-history-btn").on("click", function () {
                    console.log("Patient History button clicked. Showing dialog...");

                    frappe.call({
                        method: 'frappe.client.get_list',
                        args: {
                            doctype: 'Patient Medical Record',
                            filters: {
                                patient: frm.doc.patient
                            },
                            fields: ['record_date', 'description', 'status'],
                            order_by: 'record_date desc'
                        },
                        callback: function (response) {
                            if (response && response.message) {
                                let records = response.message;
                                let historyHtml = '<ul>';
                                records.forEach(record => {
                                    historyHtml += `<li>${record.record_date}: ${record.description} (${record.status})</li>`;
                                });
                                historyHtml += '</ul>';

                                let historyDialog = new frappe.ui.Dialog({
                                    title: 'Patient History',
                                    fields: [{
                                        fieldname: 'history_html',
                                        fieldtype: 'HTML'
                                    }],
                                    primary_action_label: 'Close',
                                    primary_action: function () {
                                        historyDialog.hide();
                                    }
                                });

                                historyDialog.fields_dict.history_html.$wrapper.html(historyHtml);
                                historyDialog.show();
                            } else {
                                frappe.msgprint(__('No patient history found.'));
                            }
                        }
                    });
                });

                console.log("Patient History button successfully added.");
                frm.custom_patient_history_button_added = true;  
            } else {
                console.warn("Tab navigation wrapper not found. Could not add Patient History button.");
            }
        }
    }
});