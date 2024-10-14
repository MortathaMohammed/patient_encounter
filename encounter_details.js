frappe.ui.form.on('Patient Encounter', {
    setup: function (frm) {
        console.log("Form setup called. Attempting to hide Encounter Details tab.");

        // Hide Encounter Details tab using DOM manipulation
        frappe.after_ajax(function () {
            let encounterTabLink = $("a:contains('Encounter Details')");
            if (encounterTabLink.length) {
                console.log("Encounter Details tab link found during setup. Removing...");
                encounterTabLink.parent().remove(); // Remove the tab link from the navigation
            } else {
                console.warn("Encounter Details tab link NOT found during setup.");
            }
        });
    },

    onload_post_render: function (frm) {
        console.log("Form onload_post_render called. Ensuring Encounter Details tab is hidden.");

        // Use jQuery to directly remove the entire "Encounter Details" tab section
        let encounterTab = $("div.section-body[data-fieldname='encounter_details_tab']");
        if (encounterTab.length) {
            console.log("Encounter Details tab section found. Removing...");
            encounterTab.remove(); // Completely remove the tab section from the form body
        } else {
            console.warn("Encounter Details section NOT found in onload_post_render.");
        }
    },

    refresh: function (frm) {
        console.log("Form refresh called. Adding Encounter Details button.");

        // Hide Encounter Details section during form refresh
        if (frm.fields_dict.encounter_details_tab) {
            frm.toggle_display('encounter_details_tab', false);
            console.log("Encounter Details section hidden during refresh.");
        } else {
            console.warn("Encounter Details section NOT found during refresh.");
        }

        // Add a button in place of the removed tab
        if (!frm.custom_encounter_details_button_added) {
            console.log("Adding Encounter Details button in place of the tab...");

            // Add the button in the tab navigation area
            let tabWrapper = $(".form-tabs");
            if (tabWrapper.length) {
                let encounterDetailsButton = `
                    <button class="btn btn-secondary btn-xs" id="encounter-details-btn" style="margin: 5px;">
                        Encounter Details
                    </button>
                `;
                tabWrapper.append(encounterDetailsButton);

                // Attach click event to open the dialog
                $("#encounter-details-btn").on("click", function () {
                    console.log("Encounter Details button clicked. Showing dialog...");

                    // Create a dialog manually with relevant fields from Encounter Details
                    let encounterDialog = new frappe.ui.Dialog({
                        title: 'Service & Medication Requests',
                        fields: [
                            {
                                label: 'Service Requests',
                                fieldname: 'service_requests_html',
                                fieldtype: 'HTML',
                            },
                            {
                                fieldtype: 'Section Break'
                            },
                            {
                                label: 'Medication Requests',
                                fieldname: 'medication_requests_html',
                                fieldtype: 'HTML',
                            }
                        ],
                        primary_action_label: 'Close',
                        primary_action: function () {
                            console.log("Closing Service & Medication Requests dialog.");
                            encounterDialog.hide();
                        }
                    });

                    // Populate Service Requests as an HTML field
                    if (frm.doc.service_requests && frm.doc.service_requests.length) {
                        let serviceRequestsHtml = '<ul>';
                        frm.doc.service_requests.forEach(request => {
                            serviceRequestsHtml += `<li>${request.service_name || ''} (${request.status || ''})</li>`;
                        });
                        serviceRequestsHtml += '</ul>';
                        encounterDialog.fields_dict.service_requests_html.$wrapper.html(serviceRequestsHtml);
                    } else {
                        encounterDialog.fields_dict.service_requests_html.$wrapper.html('<p>No Service Requests</p>');
                    }

                    // Populate Medication Requests as an HTML field
                    if (frm.doc.medication_requests && frm.doc.medication_requests.length) {
                        let medicationRequestsHtml = '<ul>';
                        frm.doc.medication_requests.forEach(request => {
                            medicationRequestsHtml += `<li>${request.medication_name || ''} (${request.dosage || ''})</li>`;
                        });
                        medicationRequestsHtml += '</ul>';
                        encounterDialog.fields_dict.medication_requests_html.$wrapper.html(medicationRequestsHtml);
                    } else {
                        encounterDialog.fields_dict.medication_requests_html.$wrapper.html('<p>No Medication Requests</p>');
                    }

                    // Show the dialog with Service & Medication Requests information
                    encounterDialog.show();
                });

                console.log("Encounter Details button successfully added.");
                frm.custom_encounter_details_button_added = true;  // Prevent button duplication
            } else {
                console.warn("Tab navigation wrapper not found. Could not add Encounter Details button.");
            }
        }
    }
});
