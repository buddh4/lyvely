export const DataPointValueType = {
    Number: 'number',
    Selection: 'selection',
    Timer: 'timer',
    Text: 'text',
};
export var DataPointInputType;
(function (DataPointInputType) {
    DataPointInputType["Checkbox"] = "checkbox";
    DataPointInputType["Range"] = "range";
    DataPointInputType["Spinner"] = "spinner";
    DataPointInputType["Timer"] = "timer";
    DataPointInputType["Textarea"] = "textarea";
    DataPointInputType["Radio"] = "radio";
    DataPointInputType["Dropdown"] = "dropdown";
})(DataPointInputType || (DataPointInputType = {}));
