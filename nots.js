frappe.ui.form.on('Patient Encounter', {
    setup: function (frm) {
        console.log("Form setup called. Attempting to hide Notes tab.");

        // Hide Notes tab using DOM manipulation
        frappe.after_ajax(function () {
            let notesTabLink = $("a:contains('Notes')");
            if (notesTabLink.length) {
                console.log("Notes tab link found during setup. Removing...");
                notesTabLink.parent().remove(); // Remove the tab link from the navigation
            } else {
                console.warn("Notes tab link NOT found during setup.");
            }
        });
    },

    onload_post_render: function (frm) {
        console.log("Form onload_post_render called. Ensuring Notes tab is hidden.");

        // Use jQuery to directly remove the entire "Notes" tab section
        let notesTab = $("div.section-body[data-fieldname='notes_tab']");
        if (notesTab.length) {
            console.log("Notes tab section found. Removing...");
            notesTab.remove(); // Completely remove the tab section from the form body
        } else {
            console.warn("Notes section NOT found in onload_post_render.");
        }
    },

    refresh: function (frm) {
        console.log("Form refresh called. Adding Notes button.");

        // Hide Notes section during form refresh
        if (frm.fields_dict.notes_tab) {
            frm.toggle_display('notes_tab', false);
            console.log("Notes section hidden during refresh.");
        } else {
            console.warn("Notes section NOT found during refresh.");
        }

        // Add a button in place of the removed tab
        if (!frm.custom_notes_button_added) {
            console.log("Adding Notes button in place of the tab...");

            // Add the button in the tab navigation area
            let tabWrapper = $(".form-tabs");
            if (tabWrapper.length) {
                let notesButton = `
                    <button class="btn btn-secondary btn-xs" id="notes-btn" style="margin: 5px;">
                        Notes
                    </button>
                `;
                tabWrapper.append(notesButton);

                // Attach click event to open the dialog
                $("#notes-btn").on("click", function () {
                    console.log("Notes button clicked. Showing dialog...");

                    // Create a dialog manually with relevant fields from Notes
                    let notesDialog = new frappe.ui.Dialog({
                        title: 'Notes',
                        fields: [
                            {
                                fieldname: 'clinical_notes_html',
                                label: 'Clinical Notes',
                                fieldtype: 'HTML',
                            }
                        ],
                        primary_action_label: 'Close',
                        primary_action: function () {
                            console.log("Closing Notes dialog.");
                            notesDialog.hide();
                        }
                    });

                    // Populate Notes as an HTML field
                    if (frm.doc.notes && frm.doc.notes.length) {
                        let notesHtml = '<ul>';
                        frm.doc.notes.forEach(note => {
                            notesHtml += `<li>${note.clinical_note || ''} - ${note.timestamp || ''}</li>`;
                        });
                        notesHtml += '</ul>';
                        notesDialog.fields_dict.clinical_notes_html.$wrapper.html(notesHtml);
                    } else {
                        notesDialog.fields_dict.clinical_notes_html.$wrapper.html('<p>No Notes</p>');
                    }

                    // Show the dialog with Notes information
                    notesDialog.show();
                });

                console.log("Notes button successfully added.");
                frm.custom_notes_button_added = true;  // Prevent button duplication
            } else {
                console.warn("Tab navigation wrapper not found. Could not add Notes button.");
            }
        }
    }
});
