frappe.ui.form.on('Patient Encounter', {
    setup: function(frm) {
        console.log("Form setup called. Adding Connections button.");

        if (!frm.custom_connections_button_added) {
            console.log("Adding Connections button.");

            let tabWrapper = $(".form-tabs");
            if (tabWrapper.length) {
                let connectionsButton = `
                    <button class="btn btn-secondary btn-xs" id="connections-btn" style="margin: 5px;">
                        Connections
                    </button>
                `;
                tabWrapper.append(connectionsButton);

                $("#connections-btn").on("click", function() {
                    console.log("Connections button clicked. Showing connections dialog...");

                    let connectionsHtml = `
                        <div class="form-dashboard-section form-links">
                            <div class="section-body">
                                <div class="transactions">
                                    <div class="form-documents">
                                        <div class="row">
                                            <div class="col-md-4">
                                                <div class="form-link-title">
                                                    <span>Records</span>
                                                </div>
                                                <div class="document-link" data-doctype="Vital Signs">
                                                    <div class="document-link-badge" data-doctype="Vital Signs">
                                                        <a class="badge-link" href="/app/vital-signs">Vital Signs</a>
                                                        <span class="count hidden"></span>
                                                    </div>
                                                </div>
                                                <div class="document-link" data-doctype="Patient Medical Record">
                                                    <div class="document-link-badge" data-doctype="Patient Medical Record">
                                                        <a class="badge-link" href="/app/patient-medical-record">Patient Medical Record</a>
                                                        <span class="count hidden"></span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-4">
                                                <div class="form-link-title">
                                                    <span>Orders</span>
                                                </div>
                                                <div class="document-link" data-doctype="Inpatient Medication Order">
                                                    <div class="document-link-badge" data-doctype="Inpatient Medication Order">
                                                        <a class="badge-link" href="/app/inpatient-medication-order">Inpatient Medication Order</a>
                                                        <span class="count hidden"></span>
                                                    </div>
                                                </div>
                                                <div class="document-link" data-doctype="Nursing Task">
                                                    <div class="document-link-badge" data-doctype="Nursing Task">
                                                        <a class="badge-link" href="/app/nursing-task">Nursing Task</a>
                                                        <span class="count hidden"></span>
                                                    </div>
                                                </div>
                                                <div class="document-link" data-doctype="Service Request">
                                                    <div class="document-link-badge" data-doctype="Service Request">
                                                        <a class="badge-link" href="/app/service-request">Service Request</a>
                                                        <span class="count hidden"></span>
                                                    </div>
                                                </div>
                                                <div class="document-link" data-doctype="Medication Request">
                                                    <div class="document-link-badge" data-doctype="Medication Request">
                                                        <a class="badge-link" href="/app/medication-request">Medication Request</a>
                                                        <span class="count hidden"></span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-4">
                                                <div class="form-link-title">
                                                    <span></span>
                                                </div>
                                                <div class="document-link" data-doctype="Clinical Note">
                                                    <div class="document-link-badge" data-doctype="Clinical Note">
                                                        <a class="badge-link" href="/app/clinical-note">Clinical Note</a>
                                                        <span class="count">1</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;

                    let connectionsDialog = new frappe.ui.Dialog({
                        title: 'Connections',
                        fields: [{
                            fieldname: 'connections_html',
                            fieldtype: 'HTML'
                        }],
                        primary_action_label: 'Close',
                        primary_action: function() {
                            connectionsDialog.hide();
                        }
                    });

                    connectionsDialog.fields_dict.connections_html.$wrapper.html(connectionsHtml);
                    connectionsDialog.show();
                });

                console.log("Connections button successfully added.");
                frm.custom_connections_button_added = true;  
            } else {
                console.warn("Tab navigation wrapper not found. Could not add Connections button.");
            }
        }
    },
        refresh: function(frm) {
        console.log("Form refresh called. Removing Connections section from Details tab if exists.");

        let connectionsSection = $(".form-dashboard-section.form-links");
        if (connectionsSection.length) {
            console.log("Connections section found in Details tab. Removing...");
            connectionsSection.remove();
        } else {
            console.warn("Connections section NOT found in Details tab during refresh.");
        }
    }
});
