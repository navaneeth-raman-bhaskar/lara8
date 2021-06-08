class DynamicRow {
    constructor(form, body = '#tBody', add = '#addRow', callBack = false) {
        this._callBack = callBack;
        this._tBody = form.find(body);
        this._addRow = form.find(add);
        this._rButton = null;
    }

    eventRegister() {
        let $obj = this;

        $obj.setIndex();

        $obj._addRow.on('click', function () {
            let newRow = $obj._tBody.find('tr:first').cloneRow();
            newRow.addClass('dynamic-row');
            $obj._tBody.append(newRow);
            $obj.setIndex();
        });

        $obj._tBody.on('click', '.removeRow', function () {
            $obj._rButton = $(this);
            if ($obj._rButton.data('url')) {
                Ajax.delete($obj._rButton.data('url'), $obj.callDelete.bind($obj));
            } else {
                $obj.callDelete();
            }
        });
    }

    callDelete() {
        let $obj = this,
            trs = $obj._tBody.find('tr');
        if (trs.length === 1) {
            let newRow = trs.first().cloneRow();
            $obj._tBody.append(newRow);
        }
        $obj._rButton.closest('tr').remove();
        if (typeof $obj._callBack === 'function') {
            $obj._callBack();
        }
        $obj.setIndex();
    }

    setIndex() {
        let $obj = this;

        $obj._tBody.find('tr').each(function (index) {
            let i, suffix = "[" + index + "]";
            $(this)
                .find('td:first').text(index + 1)
                .end()
                .find('select,textarea,input:not([role="textbox"])').each(function () {
                i = this.name.indexOf('[')
                if (i > 0)
                    this.name = this.name.substr(0, i) + suffix;
            });
        });
    }
}

class Ajax {
    static send(url, callBack, options) {
        let defaults = {
            type: 'POST',
            reload: false,
            afterComplete: false,
            afterError: false,
            buttonLoader: false, // provide '#id'
            data: '',
            extras: '',
            alert: 'notify',
            errorAlert: false
        }
        $.extend(defaults, options)
        $.ajax({
            type: defaults.type,
            url: url,
            dataType: 'json',
            data: defaults.data,
            beforeSend: function () {
                Loader.btnLoader($(defaults.buttonLoader))
            },
            success: function (res) {
                if (defaults.alert) {
                    let title = (res.title) ? res.title : 'Success'
                    if (defaults.alert === 'notify') {
                        defaults.reload ? Toastr.setSuccess(res.message) : Toastr.success(title, res.message)
                    } else if (defaults.alert) {
                        defaults.reload ? Popup.setSuccess(res.message) : Popup.alert(title, res.message)
                    }
                }
                if (defaults.reload) {
                    location.reload()
                }
                if (typeof callBack === 'function') {
                    callBack(res, options)
                }
            },
            error: function (err) {
                let responseJSON = err.responseJSON
                let call = defaults.afterError
                let message = err.responseText
                let title = 'Error'
                if (responseJSON) {
                    message = responseJSON.message
                    title = responseJSON.title || title
                }
                if (defaults.alert === 'notify' || defaults.errorAlert) {
                    Toastr.error(title, message)
                } else if (defaults.alert) {
                    Popup.error(message, title)
                }
                if (typeof call === 'function') {
                    call(err, options)
                }
            },
            complete: function (data) {
                let call = defaults.afterComplete
                if (typeof call === 'function') {
                    call(data, options)
                }
                Loader.destroyBtnLoader()
            }
        })
    }

    static delete(url, callBack = false, options = {}) {
        let defaults = {
            data: '',
            title: 'Delete!',
            notify: true,
            reload: false,
            extras: undefined,
            confirmation: true,
            type: 'DELETE'
        }

        $.extend(defaults, options)

        if (defaults.confirmation) {
            Popup.confirm({title: defaults.title, confirmCallBack: deleteRequest})
        } else {
            deleteRequest()
        }

        function deleteRequest() {
            $.ajax({
                url: url,
                type: defaults.type,
                dataType: 'json',
                data: defaults.data,
                success: function (res) {
                    let title = 'Done'
                    if (typeof res === 'string') {
                        Popup.error(res)
                    } else {
                        if (defaults.notify) {
                            if (res.title) {
                                title = res.title
                            }
                            Toastr.success(title, res.message)
                        }
                        if (defaults.reload) {
                            location.reload()
                        }
                        if (callBack) {
                            (typeof callBack == 'string') ? window[callBack](res, defaults.extras) : callBack(res, defaults.extras)
                        }
                    }
                },
                error: function (err) {
                    let responseJSON = err.responseJSON
                    let message = err.responseText
                    let title = 'Error'
                    if (responseJSON) {
                        message = responseJSON.message
                        title = responseJSON.title || title
                    }
                    Toastr.error(title, message)
                }
            })
        }
    }

    static submit(formId, options) {
        let defaults = {
            method: 'POST',
            data: '',
            url: '',
            alert: 'notify',
            reload: false,
            redirect: false,
            extras: undefined,
            callBack: false,
            beforeSendCallBack: false,
            uploadProgress: false,
            submitButton: '#js-form-submit',
            destroyLoader: false,
            resetForm: false,
            validator: false
        }

        $.extend(defaults, options)

        let title, redirectUrl
        let form = $('#' + formId)
        let disabledFields = form.find(':disabled')

        if (form.find('input[name=_method]').length > 0) {
            defaults.method = form.find('input[name=_method]').val()
        }
        disabledFields.prop('disabled', false)

        form.ajaxSubmit({
            type: 'POST',
            url: defaults.url || form.attr('action'),
            method: defaults.method,
            dataType: 'json',
            data: defaults.data,
            uploadProgress: function (event, position, total, percentComplete) {
                if (defaults.uploadProgress) {
                    $(defaults.uploadProgress.body).show()
                    $(defaults.uploadProgress.bar).css('width', percentComplete + '%')
                }
            },
            beforeSend: function () {
                if (defaults.beforeSendCallBack) {
                    (typeof defaults.beforeSendCallBack == 'string') ? window[defaults.beforeSendCallBack]() : defaults.beforeSendCallBack()
                }

                let button = $(defaults.submitButton);
                redirectUrl = defaults.redirect;
                if (!redirectUrl) {
                    redirectUrl = button.data('redirect-url');
                }
                Loader.btnLoader(button);
            },
            success: function (res) {
                disabledFields.prop('disabled', true)
                title = 'Success'
                if (defaults.alert === 'notify') {
                    if (res.title) {
                        title = res.title
                    }
                    redirectUrl ? Toastr.setSuccess(res.message) : Toastr.success(title, res.message);
                } else if (defaults.alert) {
                    Popup.alert(title, {type: 'green', text: res.message, timer: 3000})
                }

                if (defaults.reload) {
                    location.reload();
                }

                if (redirectUrl) {
                    location.replace(redirectUrl);
                }
                if (defaults.resetForm) {
                    FormValidation.resetForm(form);
                }
                if (defaults.callBack) {
                    (typeof defaults.callBack == 'string') ? window[defaults.callBack](res, defaults.extras) : defaults.callBack(res, defaults.extras);
                }
                if (defaults.uploadProgress) {
                    form.find(defaults.uploadProgress.body).hide();
                    $(defaults.uploadProgress.bar).css('width', '0');
                }
                if (defaults.destroyLoader)
                    Loader.destroyBtnLoader();
                form.find('.modal').modal('hide');
            },
            error: function (err) {
                disabledFields.prop('disabled', true)
                Loader.destroyBtnLoader()
                let responseJSON = err.responseJSON
                let message = err.responseText
                let title = 'Error'
                if (responseJSON) {
                    message = responseJSON.message
                    title = responseJSON.title || title
                }
                if (defaults.validator) {
                    defaults.validator.showErrors(responseJSON.errors);
                } else
                    Popup.error(message, title);
            }
        })
    }
}

class FormValidation {
    static init(form, options = {}) {
        this.bootUp(form)
        $.validator.setDefaults({
            ignore: ".hidden,.ql-clipboard,.ql-editor,.ql-header,[data-formula='e=mc^2']"
            // debug: true
        })
        let validator
        let defaults = {
            invalidHandler: function () {
                Toastr.error('Error!', validator.numberOfInvalids() + ' field(s) are need to be filled')
            },
            highlight: function (element) {
                let elm = $(element)
                if (elm.hasClass('nice-select')) {
                    elm = elm.next('div.nice-select')
                }
                elm.addClass('is-invalid')
            },
            unhighlight: function (element) {
                $(element).removeClass('is-invalid')
            },
            errorPlacement: function (error, element) {
                let elm = $(element)
                if (elm.hasClass('nice-select')) {
                    elm = elm.next('div.nice-select')
                }
                elm.attr({'data-toggle': 'tooltip', 'data-trigger': 'hover', title: error.text()}).tooltip()
            },
            success: function (error, element) {
                $(element).tooltip('dispose')
            }
        }
        $.extend(defaults, options)
        validator = form.validate(defaults)
        return validator;
    }

    static bootUp(form) {
        // form.find('select.nice-select').niceSelect()
        /* form.find('input.datepicker').attr({ placeholder: 'dd/mm/yyyy', autocomplete: 'off' })
            .datepicker({
                format: 'dd/mm/yyyy',
                maxViewMode: 2,
                todayBtn: 'linked',
                autoclose: true,
                todayHighlight: true
            }).filter('[value=""]').datepicker('update', new Date())// set default date to today; */

        if (form.find('select.select2').length) form.find('select.select2').select2()

        form.find('.modal').on('hidden.bs.modal', function () {
            FormValidation.resetForm(form)
        })

        /* form.find('.nice-select')
             .on('change', function () {
                 if ($(this).val() !== '') {
                     $(this).next('div.nice-select').tooltip('dispose').removeClass('is-invalid').find('label.error').remove()
                 }
             })
     */
    }

    static resetForm(form) {
        form[0].reset() // form[0] give js object instead of $ object
        form.find('label.error').remove()
        form.find('select.nice-select').niceSelect('update')
        form.find('.is-invalid').each(function () {
            $(this).tooltip('dispose')
        }).removeClass('is-invalid')
        // toastr.clear()
    }
}

class DT {
    static exportButtons(title, options) {
        let button
        let buttonCommon
        let defaults = {
            columns: ':visible , .to-export',
            exportFormat: false,
            refreshCallBack: true,
            footerCallBack: false
        }
        $.extend(defaults, options)

        buttonCommon = {
            title: title,
            footer: true,
            className: 'btn btn-outline-dark',
            exportOptions: defaults.exportFormat || {
                columns: defaults.columns,
                stripHtml: true,
                format: {
                    body: function (data, rowIndex, columnIndex, td) {
                        return $(td).contents().first().text().trim()
                    }
                }
            }
        }
        button = [
            /* $.extend(true, {}, buttonCommon, {
                extend: 'colvis',
                text: "<i class='fas fa-eye'></i>",
                titleAttr: 'Column Visibility'
            }), */
            $.extend(true, {}, buttonCommon, {
                extend: 'copy',
                text: "<i class='fa fa-copy'></i>",
                titleAttr: 'Copy'
            }),
            $.extend(true, {}, buttonCommon, {
                extend: 'csv',
                text: "<i class='fa fa-csv'></i>",
                titleAttr: 'CSV'
            }),
            $.extend(true, {}, buttonCommon, {
                extend: 'pdf',
                text: "<i class='fa fa-file-pdf'></i>",
                titleAttr: 'PDF',
                orientation: 'landscape'
            }),
            $.extend(true, {}, buttonCommon, {
                extend: 'excel',
                text: "<i class='fa fa-file-excel'></i>",
                titleAttr: 'Excel',
                autoFilter: true,
                customize: function (doc) {
                    let sheet = doc.xl.worksheets['sheet1.xml']
                    $('row:eq(1) c', sheet).attr('s', '42')
                }
            })
        ]

        button.push(printButton())
        if (defaults.refreshCallBack) {
            button.push(refreshButton())
        }
        return button

        function refreshButton() {
            return {
                text: '<i class="fa fa-redo-alt"></i>',
                titleAttr: 'Refresh',
                className: 'btn btn-outline-dark',
                action: function (e, dt) {
                    dt.state.clear()
                    if (defaults.refreshCallBack) {
                        if (typeof defaults.refreshCallBack === 'function') {
                            defaults.refreshCallBack()
                        }
                    }
                }
            }
        }

        function printButton() {
            return {
                extend: 'print',
                text: "<i class='fas fa-print'></i>",
                titleAttr: 'Print',
                title: '',
                className: 'btn btn-outline-dark',
                autoPrint: true,
                exportOptions: {
                    columns: ':visible',
                    format: {
                        body: function (data, rowIndex, columnIndex, td) {
                            return td.innerHTML
                        }
                    }
                },
                customize: function (win) {
                    let doc = $(win.document)
                    let body = doc.find('body')

                    doc.find('head').find('title').html(title + ' Print')

                    body.css('font-size', '10pt')
                        .find('table')
                        .addClass('compact')
                        .removeClass('dataTable')
                        .css('font-size', 'inherit')

                    // setPrintHeaderFooter(body);
                }
            }
        }

        function setPrintHeaderFooter(element) {
            $.ajax({
                url: '/logo',
                type: 'GET',
                data: '',
                success: function (response) {
                    element.prepend(response).find('#printTitle').html(title)
                        .end().find('#printSubTitle').html('Print')
                    if (defaults.footerCallBack) {
                        defaults.footerCallBack(element.find('table'))
                    }
                }
            })
        }
    }
}

class Popup {
    static alert(title, options) {
        let defaults = {
            timer: 0,
            text: 'Successfully Processed',
            animation: 'top',
            type: 'success',
            onDestroy: false,
            icon: ''
        };
        (typeof options === 'object') ?
            $.extend(defaults, options) : defaults.text = options
        if (defaults.type === 'red') {
            defaults.icon = 'la la-exclamation-triangle'
        } else if (defaults.type === 'green') {
            defaults.icon = 'la la-2x la-check-circle text-success'
        }
        let timer = (defaults.timer) ? 'confirm|' + defaults.timer : false


        $.alert({
            title: title,
            content: defaults.text,
            type: defaults.type,
            autoClose: timer,
            icon: defaults.icon,
            buttons: {
                confirm: {
                    text: 'Ok',
                    keys: ['enter'],
                    btnClass: 'btn-primary',
                },
            },
            onDestroy: defaults.onDestroy,
        });
    }


    static confirm(options, data) {
        let defaults = {
            title: 'Caution',
            text: 'Are you sure you want to continue?',
            type: 'warning',
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel',
            cancelCallBack: false,
            confirmCallBack: false
        };
        (typeof options === 'object') ?
            $.extend(defaults, options) : defaults.confirmCallBack = options

        $.confirm({
                title: defaults.title,
                content: defaults.text,
                type: defaults.type,
                icon: 'la la-2x la-exclamation-circle text-warning',
                buttons: {
                    cancel: {
                        text: defaults.cancelButtonText,
                        btnClass: 'btn-danger',
                        action: function () {
                            if (defaults.cancelCallBack) {
                                defaults.cancelCallBack();
                            }
                        },
                    },
                    confirm: {
                        text: defaults.confirmButtonText,
                        btnClass: 'btn-success',
                        action: function () {
                            if (defaults.confirmCallBack) {
                                defaults.confirmCallBack(data);
                            }
                        },
                    },
                },
            },
        );

    }

    /* Error Box */
    static error(options, title = 'Error') {
        let defaults = {
            type: 'red',
            text: 'Something went wrong while processing..',
            title: title
        }
        if (typeof options === 'object') {
            $.extend(defaults, options)
        } else if (typeof options == 'string') {
            defaults.text = options
        }

        $.alert({
            title: defaults.title,
            content: defaults.text,
            type: defaults.type,
            icon: defaults.icon,
            buttons: {
                confirm: {
                    text: 'Ok',
                    btnClass: 'btn-primary',
                }
            }
        });
    }

    static setSuccess(alert) {
        localStorage.setItem('successAlert', alert)
    }

    static setError(alert) {
        localStorage.setItem('errorAlert', alert)
    }
}

class Toastr {

    static success(title, msg, options = {}) {
        this._notify('success', title, msg, options)
    }

    static error(title, msg, options = {}) {
        this._notify('error', title, msg, options)
    }

    static warning(title, msg, options = {}) {
        this._notify('warning', title, msg, options)
    }

    static info(title, msg, options = {}) {
        this._notify('info', title, msg, options)
    }

    static _notify(type, title, msg, options) {
        let defaults = {
            time: 5000,
            position: 'toast-top-center'
        };
        toastr.clear();
        jQuery.extend(defaults, options);

        toastr.options = {
            closeButton: true,
            progressBar: true,
            tapToDismiss: false,
            positionClass: defaults.position,
            timeOut: defaults.time,
        };
        toastr[type](msg, title);
    }

    static setSuccess(toast) {
        localStorage.setItem('toastSuccess', toast)
    }

    static setError(toast) {
        localStorage.setItem('toastError', toast)
    }
}

class Loader {
    static btnLoader(button) {
        if (button.length) {
            button.prop('disabled', true).addClass('loadedJS').prepend('<span class="modal-spin spinner-border spinner-border-sm mr-1 loadedSpin" role="status"></span>')
        }
    }

    static destroyBtnLoader() {
        $('.loadedJS').prop('disabled', false).removeClass('loadedJS')
        $('.loadedSpin').remove()
    }
}


$.fn.cloneRow = function (disabled = false) {
    let select, newRow = this.clone();
    newRow.removeAttr('id').removeClass();
    newRow.removeAttr('data-id');
    newRow.find(':input').removeAttr('data-id');
    /*newRow.find('.bootstrap-select').each(function () {
        select = $(this).find('select');
        select.find('option.bs-title-option').remove();
        $(this).closest('td').html(select);
    });*/
    newRow.find(':input').removeClass('is-invalid').not('.keep_value').val('');
    newRow.find(':disabled').not('.keep_disabled').prop('disabled', false);
    // newRow.find('td.amount-td').html('0');
    newRow.find('button.removeRow').prop('disabled', disabled).attr({'data-url': ''});
    //   BootUp.initDynamicRow(newRow);
    return newRow; //for chaining
};

$.fn.cleanRows = function () {
    if (this.length) {
        let dynC = this.siblings('tr:not(.dynamic-row)').length;
        if (dynC < 1) {
            let newRow = this.first().cloneRow(); //.removeClass('dynamic-row') already cloneRow will remove this;
            this.closest('#tbody').append(newRow);
        }
        //this.closest('form').find('tfoot td.amount-td').html(0).number(true, 2);
        this.remove();
    }
};

const CSRF = $('#csrfToken').attr('content');
const success = localStorage.getItem("toastSuccess"),
    error = localStorage.getItem("toastError"),
    successAlert = localStorage.getItem("successAlert"),
    errorAlert = localStorage.getItem("errorAlert");


if (success) {
    Toastr.success('Success', success);
    localStorage.removeItem('toastSuccess');
}
if (error) {
    Toastr.error('Error!', error);
    localStorage.removeItem('toastError');
}
if (successAlert) {
    Popup.alert('Success', successAlert);
    localStorage.removeItem('successAlert');
}
if (errorAlert) {
    Popup.error(errorAlert);
    localStorage.removeItem('errorAlert');
}
/*
$.ajaxSetup({
    headers: {
        'X-CSRF-Token': CSRF
    },
    statusCode: {
        401: function() {
            location.reload()
        },
        419: function() {
            location.reload()
        }
    }
});*/


// class DynamicRow {
//
//     constructor(...args) {
//         this.init(...args)
//     }
//
//     init(form, tBody = '#tbody', addRow = '#addRow', callBack = false) {
//         tBody = form.find(tBody);
//         addRow = form.find(addRow);
//
//         this._form = form;
//         this._tBody = tBody;
//         this._addRow = addRow;
//         this._callBack = callBack;
//
//         this.registerEvents();
//     }
//
//     static eventRegister(...args) {
//         let newInstance = new DynamicRow(...args);
//         return newInstance;
//     }
//
//     registerEvents() {
//         this.setIndex(this._tBody);
//
//         this._form.find(this._addRow).on('click', () => {
//             let newRow = this._tBody.find('tr:first').cloneRow();
//             newRow.addClass('dynamic-row');
//             this._form.find(this._tBody).append(newRow);
//             this.setIndex(this._tBody);
//             // $('.modal-body').animate({scrollTop: newRow.offset().top}, 'fast');
//         });
//         var that = this;
//         this._tBody.on('click', '.removeRow', function() {
//             that._rButton = $(this);
//             if (that._rButton.data('url')) {
//                 Ajax.delete(that._rButton.data('url'), function() { that.callDelete(); });
//             } else {
//                 that.callDelete();
//             }
//         });
//     }
//
//     callDelete() {
//         let trs = this._tBody.find('tr');
//         if (trs.length === 1) {
//             let newRow = trs.first().cloneRow();
//             this._tBody.append(newRow);
//         }
//         this._rButton.closest('tr').remove();
//         if (typeof this._callBack === 'function')
//             this._callBack();
//         this.setIndex();
//         // $('.bs-container.dropdown.bootstrap-select').remove();
//     }
//
//     setIndex(tBody = false) {
//         tBody = tBody || this._tBody;
//         tBody.find('tr').each(function(index) {
//             let i, suffix = "[" + index + "]";
//             $(this)
//                 .find('td:first').text(index + 1)
//                 .end()
//                 .find('select,textarea,input:not([role="textbox"])').each(function() {
//                 i = this.name.indexOf('[')
//                 if (i > 0)
//                     this.name = this.name.substr(0, i) + suffix;
//             });
//         });
//     }
//
// }
