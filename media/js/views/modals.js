/*
 * MODAL VIEWS
 */

'use strict';

+function(window, $, _) {

    window.LCB = window.LCB || {};

    window.LCB.ModalView = Backbone.View.extend({
        events: {
        	'submit form': 'submit'
        },
        initialize: function(options) {
            this.render();
        },
        render: function() {
            this.$('form.validate').validate();
            this.$el.on('shown.bs.modal hidden.bs.modal',
                        _.bind(this.refresh, this));
        },
        refresh: function() {
            var that = this;
            this.$('[data-model]').each(function() {
                $(this).val && $(this).val(that.model.get($(this).data('model')));
            });
        },
        success: function() {
            swal('Updated!', '', 'success');
            this.$el.modal('hide');
        },
        error: function() {
            swal('Woops!', '', 'error');
        },
        submit: function(e) {
        	e && e.preventDefault();

            var $form = this.$('form[action]');
            var opts = {
                type: $form.attr('method') || 'POST',
                url: $form.attr('action'),
                data: $form.serialize(),
                dataType: 'json'
            };

            if (this.success) {
                opts.success = _.bind(this.success, this);
            }
            if (this.error) {
                opts.error = _.bind(this.error, this);
            }
            if (this.complete) {
                opts.complete = _.bind(this.complete, this);
            }

            $.ajax(opts);
        }
    });

    window.LCB.ProfileModalView = window.LCB.ModalView.extend({
        success: function() {
            swal('Profile Updated!', 'Your profile has been updated.',
                 'success');
            this.$el.modal('hide');
        },
        error: function() {
            swal('Woops!', 'Your profile was not updated.', 'error');
        }
    });

    window.LCB.AccountModalView = window.LCB.ModalView.extend({
        success: function() {
            swal('Account Updated!', 'Your account has been updated.', 'success');
            this.$el.modal('hide');
            this.$('[type="password"]').val('');
        },
        error: function(req) {
            var message = req.responseJSON && req.responseJSON.reason ||
                          'Your account was not updated.';

            swal('Woops!', message, 'error');
        },
        complete: function() {
            this.$('[name="current-password"]').val('');
        }
    });

    window.LCB.RoomPasswordModalView = Backbone.View.extend({
        events: {
            'click .btn-primary': 'enterRoom'
        },
        initialize: function(options) {
            this.render();
            this.$password = this.$('input.lcb-room-password-required');
        },
        render: function() {
            // this.$el.on('shown.bs.modal hidden.bs.modal',
            //             _.bind(this.refresh, this));
        },
        show: function(options) {
            this.callback = options.callback;
            this.$password.val('');
            this.$el.modal('show');
        },
        enterRoom: function() {
            this.$el.modal('hide');
            this.callback(this.$password.val());
        }
    });

    window.LCB.AuthTokensModalView = Backbone.View.extend({
        events: {
            'click .generate-token': 'generateToken',
            'click .revoke-token': 'revokeToken'
        },
        initialize: function(options) {
            this.render();
        },
        render: function() {
            this.$el.on('shown.bs.modal hidden.bs.modal',
                        _.bind(this.refresh, this));
        },
        refresh: function() {
            this.$('.token').val('');
            this.$('.generated-token').hide();
        },
        getToken: function() {
            var that = this;
            $.post('./account/token/generate', function(data) {
                if (data.token) {
                    that.$('.token').val(data.token);
                    that.$('.generated-token').show();
                }
            });
        },
        removeToken: function() {
            var that = this;
            $.post('./account/token/revoke', function(data) {
                that.refresh();
                swal('Success', 'Authentication token revoked!', 'success');
            });
        },
        generateToken: function() {
            swal({
                title: 'Are you sure?',
                text: 'This will overwrite any existing authentication token you may have.',   type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                closeOnConfirm: true },
                _.bind(this.getToken, this)
            );
        },
        revokeToken: function() {
            swal({
                title: 'Are you sure?',
                text: 'This will revoke access from any process using your current authentication token.',   type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                closeOnConfirm: false },
                _.bind(this.removeToken, this)
            );
        }
    });

}(window, $, _);
