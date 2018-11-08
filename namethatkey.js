function topKey(keys, chords) {
    var counts = {},
        result = [];
    _(keys).each(function(values, key, list) {
        counts[key] = _(values).chain().intersection(this.chords).size().value()
    }, {
        chords: chords
    });
    var max = _(counts).max();
    return _(counts).each(function(value, key, list) {
        value === this.max && result.push(key)
    }, {
        max: max
    }), result
}

function namethatkey() {
    var chords = jQuery.makeArray(jQuery(".selected").map(function() {
            return jQuery(this).html()
        })),
        topkeys = topKey(Keys, chords);
    jQuery("#result").css("display", "block"), jQuery(".selected_slice").removeClass("selected_slice"), jQuery(".selected_slice_minor").removeClass("selected_slice_minor"), jQuery(".selected_key_text").removeClass("selected_key_text"), _(topkeys).each(function(item, index) {
        var id_major = item.replace(" ", "_").replace("#", "sharp");
        jQuery("#" + id_major + " .pie").addClass("selected_slice");
        var id_minor = item.replace(" ", "_").replace("#", "sharp");
        jQuery("#" + id_minor + " .pie_minor").addClass("selected_slice_minor");
        var id_ie_major = item.replace(" ", "_").replace("#", "sharp").replace("Major", "");
        jQuery("#ie_" + id_ie_major + "Major").addClass("selected_slice");
        var id_ie_minor = item.replace(" ", "_").replace("#", "sharp").replace("Minor", "");
        jQuery("#ie_" + id_ie_minor + "Minor").addClass("selected_slice_minor");
        var id_selected_text = item.replace(" ", "_").replace("#", "sharp");
        id_selected_text += "-label", jQuery("#" + id_selected_text).addClass("selected_key_text")
    }), 0 == jQuery("#chord_selector td.selected").length && (jQuery(".selected_slice").removeClass("selected_slice"), jQuery(".selected_slice_minor").removeClass("selected_slice_minor"), jQuery(".selected_key_text").removeClass("selected_key_text"))
}