/**
 * @file Mimic polymorphy on the QR code admin form by hiding irrelevant fields
 * @see https://docs.djangoproject.com/en/4.0/ref/contrib/admin/javascript/
 */

/**
 * Mapping of selected action type to visible fields
 */
const visible = {
  none: ["action_type"],
  parameter: ["action_type", "parameter", "value"],
  character: ["action_type", "character"],
  message: ["action_type", "message"],
};

(($) => {
  /**
   * Update form row visibility
   *
   * @param {jQuery} $row The actions row containing the form rows
   * @param {string} value Current action type value, e.g. "character"
   */
  const updateRow = ($row, value) => {
    const visibleRows = visible[value];

    $(".form-row", $row).each((idx, el) => {
      const isVisible = visibleRows.some((row) =>
        $(el).hasClass(`field-${row}`)
      );
      $(el).toggleClass("hidden", !isVisible);
    });
  };

  /**
   * Add change event listener to an actions row
   *
   * @param {jQuery} $row The actions row containing the form rows
   */
  const addRow = ($row) => {
    const $select = $(".field-action_type select", $row);
    $select.on("change", () => updateRow($row, $select.val()));
    updateRow($row, $select.val());
  };

  $(document).on("formset:added", (event, $row, formsetName) => {
    if (formsetName == "actions") {
      addRow($row);
    }
  });

  $("#actions-group").each((idx, el) => addRow(el));
})(django.jQuery);
