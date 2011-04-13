
$(function() {
    function createSelection(start, end, field) {
        if (field.createTextRange) {
            /* IE calculates the end of selection range based from the starting point. */
            var newend = end - start;
            var selRange = field.createTextRange();
            selRange.collapse(true);
            selRange.moveStart("character", start);
            selRange.moveEnd("character", newend);
            selRange.select();
        } else if (field.setSelectionRange) {
            /* Other browsers calculate end of selection from the beginning of given text node. */
            field.setSelectionRange(start, end);
        }
        field.focus();
    }
    
    function sliceAndDice(value, index) {
        if(value.length == 1) {
            createSelection(index - 1, index, document.getElementById('json'));
            var repr = "" + value.charCodeAt(0);
            while(repr.length < 4) repr = "0" + repr;
            $("#result").html("Invalid character: U+" + repr);
            return;
        }
        
        var half = value.length / 2;
        var left  = value.slice(0, half);
        var right = value.slice(half);
        
        try {
            $.parseJSON("[\"" + left + "\"]");
        } catch (err) {
            createSelection(index - 1, index - 1 + half, document.getElementById('json'));
            sliceAndDice(left, index);
        }
        
        try {
            $.parseJSON("[\"" + right + "\"]");
        } catch (err) {
            createSelection(index - 1, index - 1 + half, document.getElementById('json'));
            sliceAndDice(right, index + half);
        }
    }
    
    $('#analyze').click(function() {
        var value = $('#json').attr("value");
        
        sliceAndDice(value, 0);
   });
});
