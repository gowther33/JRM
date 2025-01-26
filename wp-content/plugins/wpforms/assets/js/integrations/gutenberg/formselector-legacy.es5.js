(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/* global wpforms_gutenberg_form_selector, JSX */
/* jshint es3: false, esversion: 6 */

/**
 * @param strings.update_wp_notice_head
 * @param strings.update_wp_notice_text
 * @param strings.update_wp_notice_link
 * @param strings.wpforms_empty_help
 * @param strings.wpforms_empty_info
 */

var _wp = wp,
  _wp$serverSideRender = _wp.serverSideRender,
  ServerSideRender = _wp$serverSideRender === void 0 ? wp.components.ServerSideRender : _wp$serverSideRender;
var _wp$element = wp.element,
  createElement = _wp$element.createElement,
  Fragment = _wp$element.Fragment;
var registerBlockType = wp.blocks.registerBlockType;
var _ref = wp.blockEditor || wp.editor,
  InspectorControls = _ref.InspectorControls;
var _wp$components = wp.components,
  SelectControl = _wp$components.SelectControl,
  ToggleControl = _wp$components.ToggleControl,
  PanelBody = _wp$components.PanelBody,
  Placeholder = _wp$components.Placeholder;
var __ = wp.i18n.__;
var wpformsIcon = createElement('svg', {
  width: 20,
  height: 20,
  viewBox: '0 0 612 612',
  className: 'dashicon'
}, createElement('path', {
  fill: 'currentColor',
  d: 'M544,0H68C30.445,0,0,30.445,0,68v476c0,37.556,30.445,68,68,68h476c37.556,0,68-30.444,68-68V68 C612,30.445,581.556,0,544,0z M464.44,68L387.6,120.02L323.34,68H464.44z M288.66,68l-64.26,52.02L147.56,68H288.66z M544,544H68 V68h22.1l136,92.14l79.9-64.6l79.56,64.6l136-92.14H544V544z M114.24,263.16h95.88v-48.28h-95.88V263.16z M114.24,360.4h95.88 v-48.62h-95.88V360.4z M242.76,360.4h255v-48.62h-255V360.4L242.76,360.4z M242.76,263.16h255v-48.28h-255V263.16L242.76,263.16z M368.22,457.3h129.54V408H368.22V457.3z'
}));

/**
 * Popup container.
 *
 * @since 1.8.3
 *
 * @type {Object}
 */
var $popup = {};

/**
 * Close button (inside the form builder) click event.
 *
 * @since 1.8.3
 *
 * @param {string} clientID Block Client ID.
 */
var builderCloseButtonEvent = function builderCloseButtonEvent(clientID) {
  $popup.off('wpformsBuilderInPopupClose').on('wpformsBuilderInPopupClose', function (e, action, formId, formTitle) {
    if (action !== 'saved' || !formId) {
      return;
    }

    // Insert a new block when a new form is created from the popup to update the form list and attributes.
    var newBlock = wp.blocks.createBlock('wpforms/form-selector', {
      formId: formId.toString() // Expects string value, make sure we insert string.
    });

    // eslint-disable-next-line camelcase
    wpforms_gutenberg_form_selector.forms = [{
      ID: formId,
      post_title: formTitle
    }];

    // Insert a new block.
    wp.data.dispatch('core/block-editor').removeBlock(clientID);
    wp.data.dispatch('core/block-editor').insertBlocks(newBlock);
  });
};

/**
 * Init Modern style Dropdown fields (<select>) with choiceJS.
 *
 * @since 1.9.0
 *
 * @param {Object} e Block Details.
 */
var loadChoiceJS = function loadChoiceJS(e) {
  if (typeof window.Choices !== 'function') {
    return;
  }
  var $form = jQuery(e.detail.block.querySelector("#wpforms-".concat(e.detail.formId)));
  var config = window.wpforms_choicesjs_config || {};
  $form.find('.choicesjs-select').each(function (index, element) {
    if (!(element instanceof HTMLSelectElement)) {
      return;
    }
    var $el = jQuery(element);
    if ($el.data('choicesjs')) {
      return;
    }
    var $field = $el.closest('.wpforms-field');
    config.callbackOnInit = function () {
      var self = this,
        $element = jQuery(self.passedElement.element),
        $input = jQuery(self.input.element),
        sizeClass = $element.data('size-class');

      // Add CSS-class for size.
      if (sizeClass) {
        jQuery(self.containerOuter.element).addClass(sizeClass);
      }

      /**
       * If a multiple select has selected choices - hide a placeholder text.
       * In case if select is empty - we return placeholder text.
       */
      if ($element.prop('multiple')) {
        // On init event.
        $input.data('placeholder', $input.attr('placeholder'));
        if (self.getValue(true).length) {
          $input.removeAttr('placeholder');
        }
      }
      this.disable();
      $field.find('.is-disabled').removeClass('is-disabled');
    };
    $el.data('choicesjs', new window.Choices(element, config));

    // Placeholder fix on iframes.
    if ($el.val()) {
      $el.parent().find('.choices__input').attr('style', 'display: none !important');
    }
  });
};

// on document ready
jQuery(function () {
  jQuery(window).on('wpformsFormSelectorFormLoaded', loadChoiceJS);
});
/**
 * Open builder popup.
 *
 * @since 1.6.2
 *
 * @param {string} clientID Block Client ID.
 */
var openBuilderPopup = function openBuilderPopup(clientID) {
  if (jQuery.isEmptyObject($popup)) {
    var tmpl = jQuery('#wpforms-gutenberg-popup');
    var parent = jQuery('#wpwrap');
    parent.after(tmpl);
    $popup = parent.siblings('#wpforms-gutenberg-popup');
  }
  var url = wpforms_gutenberg_form_selector.get_started_url,
    $iframe = $popup.find('iframe');
  builderCloseButtonEvent(clientID);
  $iframe.attr('src', url);
  $popup.fadeIn();
};
var hasForms = function hasForms() {
  return wpforms_gutenberg_form_selector.forms.length > 0;
};
registerBlockType('wpforms/form-selector', {
  title: wpforms_gutenberg_form_selector.strings.title,
  description: wpforms_gutenberg_form_selector.strings.description,
  icon: wpformsIcon,
  keywords: wpforms_gutenberg_form_selector.strings.form_keywords,
  category: 'widgets',
  attributes: {
    formId: {
      type: 'string'
    },
    displayTitle: {
      type: 'boolean'
    },
    displayDesc: {
      type: 'boolean'
    },
    preview: {
      type: 'boolean'
    },
    pageTitle: {
      type: 'string'
    }
  },
  example: {
    attributes: {
      preview: true
    }
  },
  supports: {
    customClassName: hasForms()
  },
  edit: function edit(props) {
    // eslint-disable-line max-lines-per-function
    var _props$attributes = props.attributes,
      _props$attributes$for = _props$attributes.formId,
      formId = _props$attributes$for === void 0 ? '' : _props$attributes$for,
      _props$attributes$dis = _props$attributes.displayTitle,
      displayTitle = _props$attributes$dis === void 0 ? false : _props$attributes$dis,
      _props$attributes$dis2 = _props$attributes.displayDesc,
      displayDesc = _props$attributes$dis2 === void 0 ? false : _props$attributes$dis2,
      _props$attributes$pre = _props$attributes.preview,
      preview = _props$attributes$pre === void 0 ? false : _props$attributes$pre,
      setAttributes = props.setAttributes;
    var formOptions = wpforms_gutenberg_form_selector.forms.map(function (value) {
      return {
        value: value.ID,
        label: value.post_title
      };
    });
    var strings = wpforms_gutenberg_form_selector.strings;
    var jsx;
    formOptions.unshift({
      value: '',
      label: wpforms_gutenberg_form_selector.strings.form_select
    });
    function selectForm(value) {
      // eslint-disable-line jsdoc/require-jsdoc
      setAttributes({
        formId: value
      });
    }
    function toggleDisplayTitle(value) {
      // eslint-disable-line jsdoc/require-jsdoc
      setAttributes({
        displayTitle: value
      });
    }
    function toggleDisplayDesc(value) {
      // eslint-disable-line jsdoc/require-jsdoc
      setAttributes({
        displayDesc: value
      });
    }

    /**
     * Get block empty JSX code.
     *
     * @since 1.8.3
     *
     * @param {Object} blockProps Block properties.
     *
     * @return {JSX.Element} Block empty JSX code.
     */
    function getEmptyFormsPreview(blockProps) {
      var clientId = blockProps.clientId;
      return /*#__PURE__*/React.createElement(Fragment, {
        key: "wpforms-gutenberg-form-selector-fragment-block-empty"
      }, /*#__PURE__*/React.createElement("div", {
        className: "wpforms-no-form-preview"
      }, /*#__PURE__*/React.createElement("img", {
        src: wpforms_gutenberg_form_selector.block_empty_url,
        alt: ""
      }), /*#__PURE__*/React.createElement("p", {
        dangerouslySetInnerHTML: {
          __html: strings.wpforms_empty_info
        }
      }), /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: "get-started-button components-button is-button is-primary",
        onClick: function onClick() {
          openBuilderPopup(clientId);
        }
      }, __('Get Started', 'wpforms-lite')), /*#__PURE__*/React.createElement("p", {
        className: "empty-desc",
        dangerouslySetInnerHTML: {
          __html: strings.wpforms_empty_help
        }
      }), /*#__PURE__*/React.createElement("div", {
        id: "wpforms-gutenberg-popup",
        className: "wpforms-builder-popup"
      }, /*#__PURE__*/React.createElement("iframe", {
        src: "about:blank",
        width: "100%",
        height: "100%",
        id: "wpforms-builder-iframe",
        title: "wpforms-gutenberg-popup"
      }))));
    }

    /**
     * Print empty forms notice.
     *
     * @since 1.8.3
     *
     * @param {string} clientId Block client ID.
     *
     * @return {JSX.Element} Field styles JSX code.
     */
    function printEmptyFormsNotice(clientId) {
      return /*#__PURE__*/React.createElement(InspectorControls, {
        key: "wpforms-gutenberg-form-selector-inspector-main-settings"
      }, /*#__PURE__*/React.createElement(PanelBody, {
        className: "wpforms-gutenberg-panel",
        title: strings.form_settings
      }, /*#__PURE__*/React.createElement("p", {
        className: "wpforms-gutenberg-panel-notice wpforms-warning wpforms-empty-form-notice",
        style: {
          display: 'block'
        }
      }, /*#__PURE__*/React.createElement("strong", null, __('You haven’t created a form, yet!', 'wpforms-lite')), __('What are you waiting for?', 'wpforms-lite')), /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: "get-started-button components-button is-button is-secondary",
        onClick: function onClick() {
          openBuilderPopup(clientId);
        }
      }, __('Get Started', 'wpforms-lite'))));
    }

    /**
     * Get styling panels preview.
     *
     * @since 1.8.8
     *
     * @return {JSX.Element} JSX code.
     */
    function getStylingPanelsPreview() {
      return /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement(PanelBody, {
        className: "wpforms-gutenberg-panel disabled_panel",
        title: strings.themes
      }, /*#__PURE__*/React.createElement("div", {
        className: "wpforms-panel-preview wpforms-panel-preview-themes"
      })), /*#__PURE__*/React.createElement(PanelBody, {
        className: "wpforms-gutenberg-panel disabled_panel",
        title: strings.field_styles
      }, /*#__PURE__*/React.createElement("div", {
        className: "wpforms-panel-preview wpforms-panel-preview-field"
      })), /*#__PURE__*/React.createElement(PanelBody, {
        className: "wpforms-gutenberg-panel disabled_panel",
        title: strings.label_styles
      }, /*#__PURE__*/React.createElement("div", {
        className: "wpforms-panel-preview wpforms-panel-preview-label"
      })), /*#__PURE__*/React.createElement(PanelBody, {
        className: "wpforms-gutenberg-panel disabled_panel",
        title: strings.button_styles
      }, /*#__PURE__*/React.createElement("div", {
        className: "wpforms-panel-preview wpforms-panel-preview-button"
      })), /*#__PURE__*/React.createElement(PanelBody, {
        className: "wpforms-gutenberg-panel disabled_panel",
        title: strings.container_styles
      }, /*#__PURE__*/React.createElement("div", {
        className: "wpforms-panel-preview wpforms-panel-preview-container"
      })), /*#__PURE__*/React.createElement(PanelBody, {
        className: "wpforms-gutenberg-panel disabled_panel",
        title: strings.background_styles
      }, /*#__PURE__*/React.createElement("div", {
        className: "wpforms-panel-preview wpforms-panel-preview-background"
      })));
    }
    if (!hasForms()) {
      jsx = [printEmptyFormsNotice(props.clientId)];
      jsx.push(getEmptyFormsPreview(props));
      return jsx;
    }
    jsx = [/*#__PURE__*/React.createElement(InspectorControls, {
      key: "wpforms-gutenberg-form-selector-inspector-controls"
    }, /*#__PURE__*/React.createElement(PanelBody, {
      title: wpforms_gutenberg_form_selector.strings.form_settings
    }, /*#__PURE__*/React.createElement(SelectControl, {
      label: wpforms_gutenberg_form_selector.strings.form_selected,
      value: formId,
      options: formOptions,
      onChange: selectForm
    }), /*#__PURE__*/React.createElement(ToggleControl, {
      label: wpforms_gutenberg_form_selector.strings.show_title,
      checked: displayTitle,
      onChange: toggleDisplayTitle
    }), /*#__PURE__*/React.createElement(ToggleControl, {
      label: wpforms_gutenberg_form_selector.strings.show_description,
      checked: displayDesc,
      onChange: toggleDisplayDesc
    }), /*#__PURE__*/React.createElement("p", {
      className: "wpforms-gutenberg-panel-notice wpforms-warning"
    }, /*#__PURE__*/React.createElement("strong", null, strings.update_wp_notice_head), strings.update_wp_notice_text, " ", /*#__PURE__*/React.createElement("a", {
      href: strings.update_wp_notice_link,
      rel: "noreferrer",
      target: "_blank"
    }, strings.learn_more))), getStylingPanelsPreview())];
    if (formId) {
      var _document$querySelect, _document$querySelect2;
      props.setAttributes({
        pageTitle: (_document$querySelect = (_document$querySelect2 = document.querySelector('.editor-post-title__input')) === null || _document$querySelect2 === void 0 ? void 0 : _document$querySelect2.textContent) !== null && _document$querySelect !== void 0 ? _document$querySelect : ''
      });
      jsx.push( /*#__PURE__*/React.createElement(ServerSideRender, {
        key: "wpforms-gutenberg-form-selector-server-side-renderer",
        block: "wpforms/form-selector",
        attributes: props.attributes
      }));
    } else if (preview) {
      jsx.push( /*#__PURE__*/React.createElement(Fragment, {
        key: "wpforms-gutenberg-form-selector-fragment-block-preview"
      }, /*#__PURE__*/React.createElement("img", {
        src: wpforms_gutenberg_form_selector.block_preview_url,
        style: {
          width: '100%'
        },
        alt: ""
      })));
    } else {
      jsx.push( /*#__PURE__*/React.createElement(Placeholder, {
        key: "wpforms-gutenberg-form-selector-wrap",
        className: "wpforms-gutenberg-form-selector-wrap"
      }, /*#__PURE__*/React.createElement("img", {
        src: wpforms_gutenberg_form_selector.logo_url,
        alt: ""
      }), /*#__PURE__*/React.createElement(SelectControl, {
        key: "wpforms-gutenberg-form-selector-select-control",
        value: formId,
        options: formOptions,
        onChange: selectForm
      })));
    }
    return jsx;
  },
  save: function save() {
    return null;
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfd3AiLCJ3cCIsIl93cCRzZXJ2ZXJTaWRlUmVuZGVyIiwic2VydmVyU2lkZVJlbmRlciIsIlNlcnZlclNpZGVSZW5kZXIiLCJjb21wb25lbnRzIiwiX3dwJGVsZW1lbnQiLCJlbGVtZW50IiwiY3JlYXRlRWxlbWVudCIsIkZyYWdtZW50IiwicmVnaXN0ZXJCbG9ja1R5cGUiLCJibG9ja3MiLCJfcmVmIiwiYmxvY2tFZGl0b3IiLCJlZGl0b3IiLCJJbnNwZWN0b3JDb250cm9scyIsIl93cCRjb21wb25lbnRzIiwiU2VsZWN0Q29udHJvbCIsIlRvZ2dsZUNvbnRyb2wiLCJQYW5lbEJvZHkiLCJQbGFjZWhvbGRlciIsIl9fIiwiaTE4biIsIndwZm9ybXNJY29uIiwid2lkdGgiLCJoZWlnaHQiLCJ2aWV3Qm94IiwiY2xhc3NOYW1lIiwiZmlsbCIsImQiLCIkcG9wdXAiLCJidWlsZGVyQ2xvc2VCdXR0b25FdmVudCIsImNsaWVudElEIiwib2ZmIiwib24iLCJlIiwiYWN0aW9uIiwiZm9ybUlkIiwiZm9ybVRpdGxlIiwibmV3QmxvY2siLCJjcmVhdGVCbG9jayIsInRvU3RyaW5nIiwid3Bmb3Jtc19ndXRlbmJlcmdfZm9ybV9zZWxlY3RvciIsImZvcm1zIiwiSUQiLCJwb3N0X3RpdGxlIiwiZGF0YSIsImRpc3BhdGNoIiwicmVtb3ZlQmxvY2siLCJpbnNlcnRCbG9ja3MiLCJsb2FkQ2hvaWNlSlMiLCJ3aW5kb3ciLCJDaG9pY2VzIiwiJGZvcm0iLCJqUXVlcnkiLCJkZXRhaWwiLCJibG9jayIsInF1ZXJ5U2VsZWN0b3IiLCJjb25jYXQiLCJjb25maWciLCJ3cGZvcm1zX2Nob2ljZXNqc19jb25maWciLCJmaW5kIiwiZWFjaCIsImluZGV4IiwiSFRNTFNlbGVjdEVsZW1lbnQiLCIkZWwiLCIkZmllbGQiLCJjbG9zZXN0IiwiY2FsbGJhY2tPbkluaXQiLCJzZWxmIiwiJGVsZW1lbnQiLCJwYXNzZWRFbGVtZW50IiwiJGlucHV0IiwiaW5wdXQiLCJzaXplQ2xhc3MiLCJjb250YWluZXJPdXRlciIsImFkZENsYXNzIiwicHJvcCIsImF0dHIiLCJnZXRWYWx1ZSIsImxlbmd0aCIsInJlbW92ZUF0dHIiLCJkaXNhYmxlIiwicmVtb3ZlQ2xhc3MiLCJ2YWwiLCJwYXJlbnQiLCJvcGVuQnVpbGRlclBvcHVwIiwiaXNFbXB0eU9iamVjdCIsInRtcGwiLCJhZnRlciIsInNpYmxpbmdzIiwidXJsIiwiZ2V0X3N0YXJ0ZWRfdXJsIiwiJGlmcmFtZSIsImZhZGVJbiIsImhhc0Zvcm1zIiwidGl0bGUiLCJzdHJpbmdzIiwiZGVzY3JpcHRpb24iLCJpY29uIiwia2V5d29yZHMiLCJmb3JtX2tleXdvcmRzIiwiY2F0ZWdvcnkiLCJhdHRyaWJ1dGVzIiwidHlwZSIsImRpc3BsYXlUaXRsZSIsImRpc3BsYXlEZXNjIiwicHJldmlldyIsInBhZ2VUaXRsZSIsImV4YW1wbGUiLCJzdXBwb3J0cyIsImN1c3RvbUNsYXNzTmFtZSIsImVkaXQiLCJwcm9wcyIsIl9wcm9wcyRhdHRyaWJ1dGVzIiwiX3Byb3BzJGF0dHJpYnV0ZXMkZm9yIiwiX3Byb3BzJGF0dHJpYnV0ZXMkZGlzIiwiX3Byb3BzJGF0dHJpYnV0ZXMkZGlzMiIsIl9wcm9wcyRhdHRyaWJ1dGVzJHByZSIsInNldEF0dHJpYnV0ZXMiLCJmb3JtT3B0aW9ucyIsIm1hcCIsInZhbHVlIiwibGFiZWwiLCJqc3giLCJ1bnNoaWZ0IiwiZm9ybV9zZWxlY3QiLCJzZWxlY3RGb3JtIiwidG9nZ2xlRGlzcGxheVRpdGxlIiwidG9nZ2xlRGlzcGxheURlc2MiLCJnZXRFbXB0eUZvcm1zUHJldmlldyIsImJsb2NrUHJvcHMiLCJjbGllbnRJZCIsIlJlYWN0Iiwia2V5Iiwic3JjIiwiYmxvY2tfZW1wdHlfdXJsIiwiYWx0IiwiZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwiLCJfX2h0bWwiLCJ3cGZvcm1zX2VtcHR5X2luZm8iLCJvbkNsaWNrIiwid3Bmb3Jtc19lbXB0eV9oZWxwIiwiaWQiLCJwcmludEVtcHR5Rm9ybXNOb3RpY2UiLCJmb3JtX3NldHRpbmdzIiwic3R5bGUiLCJkaXNwbGF5IiwiZ2V0U3R5bGluZ1BhbmVsc1ByZXZpZXciLCJ0aGVtZXMiLCJmaWVsZF9zdHlsZXMiLCJsYWJlbF9zdHlsZXMiLCJidXR0b25fc3R5bGVzIiwiY29udGFpbmVyX3N0eWxlcyIsImJhY2tncm91bmRfc3R5bGVzIiwicHVzaCIsImZvcm1fc2VsZWN0ZWQiLCJvcHRpb25zIiwib25DaGFuZ2UiLCJzaG93X3RpdGxlIiwiY2hlY2tlZCIsInNob3dfZGVzY3JpcHRpb24iLCJ1cGRhdGVfd3Bfbm90aWNlX2hlYWQiLCJ1cGRhdGVfd3Bfbm90aWNlX3RleHQiLCJocmVmIiwidXBkYXRlX3dwX25vdGljZV9saW5rIiwicmVsIiwidGFyZ2V0IiwibGVhcm5fbW9yZSIsIl9kb2N1bWVudCRxdWVyeVNlbGVjdCIsIl9kb2N1bWVudCRxdWVyeVNlbGVjdDIiLCJkb2N1bWVudCIsInRleHRDb250ZW50IiwiYmxvY2tfcHJldmlld191cmwiLCJsb2dvX3VybCIsInNhdmUiXSwic291cmNlcyI6WyJmYWtlXzc1YjkzMTE0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIGdsb2JhbCB3cGZvcm1zX2d1dGVuYmVyZ19mb3JtX3NlbGVjdG9yLCBKU1ggKi9cbi8qIGpzaGludCBlczM6IGZhbHNlLCBlc3ZlcnNpb246IDYgKi9cblxuLyoqXG4gKiBAcGFyYW0gc3RyaW5ncy51cGRhdGVfd3Bfbm90aWNlX2hlYWRcbiAqIEBwYXJhbSBzdHJpbmdzLnVwZGF0ZV93cF9ub3RpY2VfdGV4dFxuICogQHBhcmFtIHN0cmluZ3MudXBkYXRlX3dwX25vdGljZV9saW5rXG4gKiBAcGFyYW0gc3RyaW5ncy53cGZvcm1zX2VtcHR5X2hlbHBcbiAqIEBwYXJhbSBzdHJpbmdzLndwZm9ybXNfZW1wdHlfaW5mb1xuICovXG5cbmNvbnN0IHsgc2VydmVyU2lkZVJlbmRlcjogU2VydmVyU2lkZVJlbmRlciA9IHdwLmNvbXBvbmVudHMuU2VydmVyU2lkZVJlbmRlciB9ID0gd3A7XG5jb25zdCB7IGNyZWF0ZUVsZW1lbnQsIEZyYWdtZW50IH0gPSB3cC5lbGVtZW50O1xuY29uc3QgeyByZWdpc3RlckJsb2NrVHlwZSB9ID0gd3AuYmxvY2tzO1xuY29uc3QgeyBJbnNwZWN0b3JDb250cm9scyB9ID0gd3AuYmxvY2tFZGl0b3IgfHwgd3AuZWRpdG9yO1xuY29uc3QgeyBTZWxlY3RDb250cm9sLCBUb2dnbGVDb250cm9sLCBQYW5lbEJvZHksIFBsYWNlaG9sZGVyIH0gPSB3cC5jb21wb25lbnRzO1xuY29uc3QgeyBfXyB9ID0gd3AuaTE4bjtcblxuY29uc3Qgd3Bmb3Jtc0ljb24gPSBjcmVhdGVFbGVtZW50KCAnc3ZnJywgeyB3aWR0aDogMjAsIGhlaWdodDogMjAsIHZpZXdCb3g6ICcwIDAgNjEyIDYxMicsIGNsYXNzTmFtZTogJ2Rhc2hpY29uJyB9LFxuXHRjcmVhdGVFbGVtZW50KCAncGF0aCcsIHtcblx0XHRmaWxsOiAnY3VycmVudENvbG9yJyxcblx0XHRkOiAnTTU0NCwwSDY4QzMwLjQ0NSwwLDAsMzAuNDQ1LDAsNjh2NDc2YzAsMzcuNTU2LDMwLjQ0NSw2OCw2OCw2OGg0NzZjMzcuNTU2LDAsNjgtMzAuNDQ0LDY4LTY4VjY4IEM2MTIsMzAuNDQ1LDU4MS41NTYsMCw1NDQsMHogTTQ2NC40NCw2OEwzODcuNiwxMjAuMDJMMzIzLjM0LDY4SDQ2NC40NHogTTI4OC42Niw2OGwtNjQuMjYsNTIuMDJMMTQ3LjU2LDY4SDI4OC42NnogTTU0NCw1NDRINjggVjY4aDIyLjFsMTM2LDkyLjE0bDc5LjktNjQuNmw3OS41Niw2NC42bDEzNi05Mi4xNEg1NDRWNTQ0eiBNMTE0LjI0LDI2My4xNmg5NS44OHYtNDguMjhoLTk1Ljg4VjI2My4xNnogTTExNC4yNCwzNjAuNGg5NS44OCB2LTQ4LjYyaC05NS44OFYzNjAuNHogTTI0Mi43NiwzNjAuNGgyNTV2LTQ4LjYyaC0yNTVWMzYwLjRMMjQyLjc2LDM2MC40eiBNMjQyLjc2LDI2My4xNmgyNTV2LTQ4LjI4aC0yNTVWMjYzLjE2TDI0Mi43NiwyNjMuMTZ6IE0zNjguMjIsNDU3LjNoMTI5LjU0VjQwOEgzNjguMjJWNDU3LjN6Jyxcblx0fSApXG4pO1xuXG4vKipcbiAqIFBvcHVwIGNvbnRhaW5lci5cbiAqXG4gKiBAc2luY2UgMS44LjNcbiAqXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG5sZXQgJHBvcHVwID0ge307XG5cbi8qKlxuICogQ2xvc2UgYnV0dG9uIChpbnNpZGUgdGhlIGZvcm0gYnVpbGRlcikgY2xpY2sgZXZlbnQuXG4gKlxuICogQHNpbmNlIDEuOC4zXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGNsaWVudElEIEJsb2NrIENsaWVudCBJRC5cbiAqL1xuY29uc3QgYnVpbGRlckNsb3NlQnV0dG9uRXZlbnQgPSBmdW5jdGlvbiggY2xpZW50SUQgKSB7XG5cdCRwb3B1cFxuXHRcdC5vZmYoICd3cGZvcm1zQnVpbGRlckluUG9wdXBDbG9zZScgKVxuXHRcdC5vbiggJ3dwZm9ybXNCdWlsZGVySW5Qb3B1cENsb3NlJywgZnVuY3Rpb24oIGUsIGFjdGlvbiwgZm9ybUlkLCBmb3JtVGl0bGUgKSB7XG5cdFx0XHRpZiAoIGFjdGlvbiAhPT0gJ3NhdmVkJyB8fCAhIGZvcm1JZCApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBJbnNlcnQgYSBuZXcgYmxvY2sgd2hlbiBhIG5ldyBmb3JtIGlzIGNyZWF0ZWQgZnJvbSB0aGUgcG9wdXAgdG8gdXBkYXRlIHRoZSBmb3JtIGxpc3QgYW5kIGF0dHJpYnV0ZXMuXG5cdFx0XHRjb25zdCBuZXdCbG9jayA9IHdwLmJsb2Nrcy5jcmVhdGVCbG9jayggJ3dwZm9ybXMvZm9ybS1zZWxlY3RvcicsIHtcblx0XHRcdFx0Zm9ybUlkOiBmb3JtSWQudG9TdHJpbmcoKSwgLy8gRXhwZWN0cyBzdHJpbmcgdmFsdWUsIG1ha2Ugc3VyZSB3ZSBpbnNlcnQgc3RyaW5nLlxuXHRcdFx0fSApO1xuXG5cdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY2FtZWxjYXNlXG5cdFx0XHR3cGZvcm1zX2d1dGVuYmVyZ19mb3JtX3NlbGVjdG9yLmZvcm1zID0gWyB7IElEOiBmb3JtSWQsIHBvc3RfdGl0bGU6IGZvcm1UaXRsZSB9IF07XG5cblx0XHRcdC8vIEluc2VydCBhIG5ldyBibG9jay5cblx0XHRcdHdwLmRhdGEuZGlzcGF0Y2goICdjb3JlL2Jsb2NrLWVkaXRvcicgKS5yZW1vdmVCbG9jayggY2xpZW50SUQgKTtcblx0XHRcdHdwLmRhdGEuZGlzcGF0Y2goICdjb3JlL2Jsb2NrLWVkaXRvcicgKS5pbnNlcnRCbG9ja3MoIG5ld0Jsb2NrICk7XG5cdFx0fSApO1xufTtcblxuLyoqXG4gKiBJbml0IE1vZGVybiBzdHlsZSBEcm9wZG93biBmaWVsZHMgKDxzZWxlY3Q+KSB3aXRoIGNob2ljZUpTLlxuICpcbiAqIEBzaW5jZSB7VkVSU0lPTn1cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZSBCbG9jayBEZXRhaWxzLlxuICovXG5jb25zdCBsb2FkQ2hvaWNlSlMgPSBmdW5jdGlvbiggZSApIHtcblx0aWYgKCB0eXBlb2Ygd2luZG93LkNob2ljZXMgIT09ICdmdW5jdGlvbicgKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0Y29uc3QgJGZvcm0gPSBqUXVlcnkoIGUuZGV0YWlsLmJsb2NrLnF1ZXJ5U2VsZWN0b3IoIGAjd3Bmb3Jtcy0keyBlLmRldGFpbC5mb3JtSWQgfWAgKSApO1xuXHRjb25zdCBjb25maWcgPSB3aW5kb3cud3Bmb3Jtc19jaG9pY2VzanNfY29uZmlnIHx8IHt9O1xuXG5cdCRmb3JtLmZpbmQoICcuY2hvaWNlc2pzLXNlbGVjdCcgKS5lYWNoKCBmdW5jdGlvbiggaW5kZXgsIGVsZW1lbnQgKSB7XG5cdFx0aWYgKCAhICggZWxlbWVudCBpbnN0YW5jZW9mIEhUTUxTZWxlY3RFbGVtZW50ICkgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgJGVsID0galF1ZXJ5KCBlbGVtZW50ICk7XG5cblx0XHRpZiAoICRlbC5kYXRhKCAnY2hvaWNlc2pzJyApICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0ICRmaWVsZCA9ICRlbC5jbG9zZXN0KCAnLndwZm9ybXMtZmllbGQnICk7XG5cblx0XHRjb25maWcuY2FsbGJhY2tPbkluaXQgPSBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0IHNlbGYgPSB0aGlzLFxuXHRcdFx0XHQkZWxlbWVudCA9IGpRdWVyeSggc2VsZi5wYXNzZWRFbGVtZW50LmVsZW1lbnQgKSxcblx0XHRcdFx0JGlucHV0ID0galF1ZXJ5KCBzZWxmLmlucHV0LmVsZW1lbnQgKSxcblx0XHRcdFx0c2l6ZUNsYXNzID0gJGVsZW1lbnQuZGF0YSggJ3NpemUtY2xhc3MnICk7XG5cblx0XHRcdC8vIEFkZCBDU1MtY2xhc3MgZm9yIHNpemUuXG5cdFx0XHRpZiAoIHNpemVDbGFzcyApIHtcblx0XHRcdFx0alF1ZXJ5KCBzZWxmLmNvbnRhaW5lck91dGVyLmVsZW1lbnQgKS5hZGRDbGFzcyggc2l6ZUNsYXNzICk7XG5cdFx0XHR9XG5cblx0XHRcdC8qKlxuXHRcdFx0ICogSWYgYSBtdWx0aXBsZSBzZWxlY3QgaGFzIHNlbGVjdGVkIGNob2ljZXMgLSBoaWRlIGEgcGxhY2Vob2xkZXIgdGV4dC5cblx0XHRcdCAqIEluIGNhc2UgaWYgc2VsZWN0IGlzIGVtcHR5IC0gd2UgcmV0dXJuIHBsYWNlaG9sZGVyIHRleHQuXG5cdFx0XHQgKi9cblx0XHRcdGlmICggJGVsZW1lbnQucHJvcCggJ211bHRpcGxlJyApICkge1xuXHRcdFx0XHQvLyBPbiBpbml0IGV2ZW50LlxuXHRcdFx0XHQkaW5wdXQuZGF0YSggJ3BsYWNlaG9sZGVyJywgJGlucHV0LmF0dHIoICdwbGFjZWhvbGRlcicgKSApO1xuXG5cdFx0XHRcdGlmICggc2VsZi5nZXRWYWx1ZSggdHJ1ZSApLmxlbmd0aCApIHtcblx0XHRcdFx0XHQkaW5wdXQucmVtb3ZlQXR0ciggJ3BsYWNlaG9sZGVyJyApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuZGlzYWJsZSgpO1xuXHRcdFx0JGZpZWxkLmZpbmQoICcuaXMtZGlzYWJsZWQnICkucmVtb3ZlQ2xhc3MoICdpcy1kaXNhYmxlZCcgKTtcblx0XHR9O1xuXG5cdFx0JGVsLmRhdGEoICdjaG9pY2VzanMnLCBuZXcgd2luZG93LkNob2ljZXMoIGVsZW1lbnQsIGNvbmZpZyApICk7XG5cblx0XHQvLyBQbGFjZWhvbGRlciBmaXggb24gaWZyYW1lcy5cblx0XHRpZiAoICRlbC52YWwoKSApIHtcblx0XHRcdCRlbC5wYXJlbnQoKS5maW5kKCAnLmNob2ljZXNfX2lucHV0JyApLmF0dHIoICdzdHlsZScsICdkaXNwbGF5OiBub25lICFpbXBvcnRhbnQnICk7XG5cdFx0fVxuXHR9ICk7XG59O1xuXG4vLyBvbiBkb2N1bWVudCByZWFkeVxualF1ZXJ5KCBmdW5jdGlvbigpIHtcblx0alF1ZXJ5KCB3aW5kb3cgKS5vbiggJ3dwZm9ybXNGb3JtU2VsZWN0b3JGb3JtTG9hZGVkJywgbG9hZENob2ljZUpTICk7XG59ICk7XG4vKipcbiAqIE9wZW4gYnVpbGRlciBwb3B1cC5cbiAqXG4gKiBAc2luY2UgMS42LjJcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gY2xpZW50SUQgQmxvY2sgQ2xpZW50IElELlxuICovXG5jb25zdCBvcGVuQnVpbGRlclBvcHVwID0gZnVuY3Rpb24oIGNsaWVudElEICkge1xuXHRpZiAoIGpRdWVyeS5pc0VtcHR5T2JqZWN0KCAkcG9wdXAgKSApIHtcblx0XHRjb25zdCB0bXBsID0galF1ZXJ5KCAnI3dwZm9ybXMtZ3V0ZW5iZXJnLXBvcHVwJyApO1xuXHRcdGNvbnN0IHBhcmVudCA9IGpRdWVyeSggJyN3cHdyYXAnICk7XG5cblx0XHRwYXJlbnQuYWZ0ZXIoIHRtcGwgKTtcblxuXHRcdCRwb3B1cCA9IHBhcmVudC5zaWJsaW5ncyggJyN3cGZvcm1zLWd1dGVuYmVyZy1wb3B1cCcgKTtcblx0fVxuXG5cdGNvbnN0IHVybCA9IHdwZm9ybXNfZ3V0ZW5iZXJnX2Zvcm1fc2VsZWN0b3IuZ2V0X3N0YXJ0ZWRfdXJsLFxuXHRcdCRpZnJhbWUgPSAkcG9wdXAuZmluZCggJ2lmcmFtZScgKTtcblxuXHRidWlsZGVyQ2xvc2VCdXR0b25FdmVudCggY2xpZW50SUQgKTtcblx0JGlmcmFtZS5hdHRyKCAnc3JjJywgdXJsICk7XG5cdCRwb3B1cC5mYWRlSW4oKTtcbn07XG5cbmNvbnN0IGhhc0Zvcm1zID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB3cGZvcm1zX2d1dGVuYmVyZ19mb3JtX3NlbGVjdG9yLmZvcm1zLmxlbmd0aCA+IDA7XG59O1xuXG5yZWdpc3RlckJsb2NrVHlwZSggJ3dwZm9ybXMvZm9ybS1zZWxlY3RvcicsIHtcblx0dGl0bGU6IHdwZm9ybXNfZ3V0ZW5iZXJnX2Zvcm1fc2VsZWN0b3Iuc3RyaW5ncy50aXRsZSxcblx0ZGVzY3JpcHRpb246IHdwZm9ybXNfZ3V0ZW5iZXJnX2Zvcm1fc2VsZWN0b3Iuc3RyaW5ncy5kZXNjcmlwdGlvbixcblx0aWNvbjogd3Bmb3Jtc0ljb24sXG5cdGtleXdvcmRzOiB3cGZvcm1zX2d1dGVuYmVyZ19mb3JtX3NlbGVjdG9yLnN0cmluZ3MuZm9ybV9rZXl3b3Jkcyxcblx0Y2F0ZWdvcnk6ICd3aWRnZXRzJyxcblx0YXR0cmlidXRlczoge1xuXHRcdGZvcm1JZDoge1xuXHRcdFx0dHlwZTogJ3N0cmluZycsXG5cdFx0fSxcblx0XHRkaXNwbGF5VGl0bGU6IHtcblx0XHRcdHR5cGU6ICdib29sZWFuJyxcblx0XHR9LFxuXHRcdGRpc3BsYXlEZXNjOiB7XG5cdFx0XHR0eXBlOiAnYm9vbGVhbicsXG5cdFx0fSxcblx0XHRwcmV2aWV3OiB7XG5cdFx0XHR0eXBlOiAnYm9vbGVhbicsXG5cdFx0fSxcblx0XHRwYWdlVGl0bGU6IHtcblx0XHRcdHR5cGU6ICdzdHJpbmcnLFxuXHRcdH0sXG5cdH0sXG5cdGV4YW1wbGU6IHtcblx0XHRhdHRyaWJ1dGVzOiB7XG5cdFx0XHRwcmV2aWV3OiB0cnVlLFxuXHRcdH0sXG5cdH0sXG5cdHN1cHBvcnRzOiB7XG5cdFx0Y3VzdG9tQ2xhc3NOYW1lOiBoYXNGb3JtcygpLFxuXHR9LFxuXHRlZGl0KCBwcm9wcyApIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBtYXgtbGluZXMtcGVyLWZ1bmN0aW9uXG5cdFx0Y29uc3QgeyBhdHRyaWJ1dGVzOiB7IGZvcm1JZCA9ICcnLCBkaXNwbGF5VGl0bGUgPSBmYWxzZSwgZGlzcGxheURlc2MgPSBmYWxzZSwgcHJldmlldyA9IGZhbHNlIH0sIHNldEF0dHJpYnV0ZXMgfSA9IHByb3BzO1xuXHRcdGNvbnN0IGZvcm1PcHRpb25zID0gd3Bmb3Jtc19ndXRlbmJlcmdfZm9ybV9zZWxlY3Rvci5mb3Jtcy5tYXAoICggdmFsdWUgKSA9PiAoXG5cdFx0XHR7IHZhbHVlOiB2YWx1ZS5JRCwgbGFiZWw6IHZhbHVlLnBvc3RfdGl0bGUgfVxuXHRcdCkgKTtcblxuXHRcdGNvbnN0IHN0cmluZ3MgPSB3cGZvcm1zX2d1dGVuYmVyZ19mb3JtX3NlbGVjdG9yLnN0cmluZ3M7XG5cdFx0bGV0IGpzeDtcblxuXHRcdGZvcm1PcHRpb25zLnVuc2hpZnQoIHsgdmFsdWU6ICcnLCBsYWJlbDogd3Bmb3Jtc19ndXRlbmJlcmdfZm9ybV9zZWxlY3Rvci5zdHJpbmdzLmZvcm1fc2VsZWN0IH0gKTtcblxuXHRcdGZ1bmN0aW9uIHNlbGVjdEZvcm0oIHZhbHVlICkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGpzZG9jL3JlcXVpcmUtanNkb2Ncblx0XHRcdHNldEF0dHJpYnV0ZXMoIHsgZm9ybUlkOiB2YWx1ZSB9ICk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gdG9nZ2xlRGlzcGxheVRpdGxlKCB2YWx1ZSApIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBqc2RvYy9yZXF1aXJlLWpzZG9jXG5cdFx0XHRzZXRBdHRyaWJ1dGVzKCB7IGRpc3BsYXlUaXRsZTogdmFsdWUgfSApO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHRvZ2dsZURpc3BsYXlEZXNjKCB2YWx1ZSApIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBqc2RvYy9yZXF1aXJlLWpzZG9jXG5cdFx0XHRzZXRBdHRyaWJ1dGVzKCB7IGRpc3BsYXlEZXNjOiB2YWx1ZSB9ICk7XG5cdFx0fVxuXG5cdFx0LyoqXG5cdFx0ICogR2V0IGJsb2NrIGVtcHR5IEpTWCBjb2RlLlxuXHRcdCAqXG5cdFx0ICogQHNpbmNlIDEuOC4zXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge09iamVjdH0gYmxvY2tQcm9wcyBCbG9jayBwcm9wZXJ0aWVzLlxuXHRcdCAqXG5cdFx0ICogQHJldHVybiB7SlNYLkVsZW1lbnR9IEJsb2NrIGVtcHR5IEpTWCBjb2RlLlxuXHRcdCAqL1xuXHRcdGZ1bmN0aW9uIGdldEVtcHR5Rm9ybXNQcmV2aWV3KCBibG9ja1Byb3BzICkge1xuXHRcdFx0Y29uc3QgY2xpZW50SWQgPSBibG9ja1Byb3BzLmNsaWVudElkO1xuXG5cdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHQ8RnJhZ21lbnRcblx0XHRcdFx0XHRrZXk9XCJ3cGZvcm1zLWd1dGVuYmVyZy1mb3JtLXNlbGVjdG9yLWZyYWdtZW50LWJsb2NrLWVtcHR5XCI+XG5cdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJ3cGZvcm1zLW5vLWZvcm0tcHJldmlld1wiPlxuXHRcdFx0XHRcdFx0PGltZyBzcmM9eyB3cGZvcm1zX2d1dGVuYmVyZ19mb3JtX3NlbGVjdG9yLmJsb2NrX2VtcHR5X3VybCB9IGFsdD1cIlwiIC8+XG5cdFx0XHRcdFx0XHQ8cCBkYW5nZXJvdXNseVNldElubmVySFRNTD17IHsgX19odG1sOiBzdHJpbmdzLndwZm9ybXNfZW1wdHlfaW5mbyB9IH0+PC9wPlxuXHRcdFx0XHRcdFx0PGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiZ2V0LXN0YXJ0ZWQtYnV0dG9uIGNvbXBvbmVudHMtYnV0dG9uIGlzLWJ1dHRvbiBpcy1wcmltYXJ5XCJcblx0XHRcdFx0XHRcdFx0b25DbGljaz17XG5cdFx0XHRcdFx0XHRcdFx0KCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0b3BlbkJ1aWxkZXJQb3B1cCggY2xpZW50SWQgKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdD5cblx0XHRcdFx0XHRcdFx0eyBfXyggJ0dldCBTdGFydGVkJywgJ3dwZm9ybXMtbGl0ZScgKSB9XG5cdFx0XHRcdFx0XHQ8L2J1dHRvbj5cblx0XHRcdFx0XHRcdDxwIGNsYXNzTmFtZT1cImVtcHR5LWRlc2NcIiBkYW5nZXJvdXNseVNldElubmVySFRNTD17IHsgX19odG1sOiBzdHJpbmdzLndwZm9ybXNfZW1wdHlfaGVscCB9IH0+PC9wPlxuXG5cdFx0XHRcdFx0XHR7IC8qIFRlbXBsYXRlIGZvciBwb3B1cCB3aXRoIGJ1aWxkZXIgaWZyYW1lICovIH1cblx0XHRcdFx0XHRcdDxkaXYgaWQ9XCJ3cGZvcm1zLWd1dGVuYmVyZy1wb3B1cFwiIGNsYXNzTmFtZT1cIndwZm9ybXMtYnVpbGRlci1wb3B1cFwiPlxuXHRcdFx0XHRcdFx0XHQ8aWZyYW1lIHNyYz1cImFib3V0OmJsYW5rXCIgd2lkdGg9XCIxMDAlXCIgaGVpZ2h0PVwiMTAwJVwiIGlkPVwid3Bmb3Jtcy1idWlsZGVyLWlmcmFtZVwiIHRpdGxlPVwid3Bmb3Jtcy1ndXRlbmJlcmctcG9wdXBcIj48L2lmcmFtZT5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8L0ZyYWdtZW50PlxuXHRcdFx0KTtcblx0XHR9XG5cblx0XHQvKipcblx0XHQgKiBQcmludCBlbXB0eSBmb3JtcyBub3RpY2UuXG5cdFx0ICpcblx0XHQgKiBAc2luY2UgMS44LjNcblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSBjbGllbnRJZCBCbG9jayBjbGllbnQgSUQuXG5cdFx0ICpcblx0XHQgKiBAcmV0dXJuIHtKU1guRWxlbWVudH0gRmllbGQgc3R5bGVzIEpTWCBjb2RlLlxuXHRcdCAqL1xuXHRcdGZ1bmN0aW9uIHByaW50RW1wdHlGb3Jtc05vdGljZSggY2xpZW50SWQgKSB7XG5cdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHQ8SW5zcGVjdG9yQ29udHJvbHMga2V5PVwid3Bmb3Jtcy1ndXRlbmJlcmctZm9ybS1zZWxlY3Rvci1pbnNwZWN0b3ItbWFpbi1zZXR0aW5nc1wiPlxuXHRcdFx0XHRcdDxQYW5lbEJvZHkgY2xhc3NOYW1lPVwid3Bmb3Jtcy1ndXRlbmJlcmctcGFuZWxcIiB0aXRsZT17IHN0cmluZ3MuZm9ybV9zZXR0aW5ncyB9PlxuXHRcdFx0XHRcdFx0PHAgY2xhc3NOYW1lPVwid3Bmb3Jtcy1ndXRlbmJlcmctcGFuZWwtbm90aWNlIHdwZm9ybXMtd2FybmluZyB3cGZvcm1zLWVtcHR5LWZvcm0tbm90aWNlXCIgc3R5bGU9eyB7IGRpc3BsYXk6ICdibG9jaycgfSB9PlxuXHRcdFx0XHRcdFx0XHQ8c3Ryb25nPnsgX18oICdZb3UgaGF2ZW7igJl0IGNyZWF0ZWQgYSBmb3JtLCB5ZXQhJywgJ3dwZm9ybXMtbGl0ZScgKSB9PC9zdHJvbmc+XG5cdFx0XHRcdFx0XHRcdHsgX18oICdXaGF0IGFyZSB5b3Ugd2FpdGluZyBmb3I/JywgJ3dwZm9ybXMtbGl0ZScgKSB9XG5cdFx0XHRcdFx0XHQ8L3A+XG5cdFx0XHRcdFx0XHQ8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJnZXQtc3RhcnRlZC1idXR0b24gY29tcG9uZW50cy1idXR0b24gaXMtYnV0dG9uIGlzLXNlY29uZGFyeVwiXG5cdFx0XHRcdFx0XHRcdG9uQ2xpY2s9e1xuXHRcdFx0XHRcdFx0XHRcdCgpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRcdG9wZW5CdWlsZGVyUG9wdXAoIGNsaWVudElkICk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQ+XG5cdFx0XHRcdFx0XHRcdHsgX18oICdHZXQgU3RhcnRlZCcsICd3cGZvcm1zLWxpdGUnICkgfVxuXHRcdFx0XHRcdFx0PC9idXR0b24+XG5cdFx0XHRcdFx0PC9QYW5lbEJvZHk+XG5cdFx0XHRcdDwvSW5zcGVjdG9yQ29udHJvbHM+XG5cdFx0XHQpO1xuXHRcdH1cblxuXHRcdC8qKlxuXHRcdCAqIEdldCBzdHlsaW5nIHBhbmVscyBwcmV2aWV3LlxuXHRcdCAqXG5cdFx0ICogQHNpbmNlIDEuOC44XG5cdFx0ICpcblx0XHQgKiBAcmV0dXJuIHtKU1guRWxlbWVudH0gSlNYIGNvZGUuXG5cdFx0ICovXG5cdFx0ZnVuY3Rpb24gZ2V0U3R5bGluZ1BhbmVsc1ByZXZpZXcoKSB7XG5cdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHQ8RnJhZ21lbnQ+XG5cdFx0XHRcdFx0PFBhbmVsQm9keSBjbGFzc05hbWU9XCJ3cGZvcm1zLWd1dGVuYmVyZy1wYW5lbCBkaXNhYmxlZF9wYW5lbFwiIHRpdGxlPXsgc3RyaW5ncy50aGVtZXMgfT5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwid3Bmb3Jtcy1wYW5lbC1wcmV2aWV3IHdwZm9ybXMtcGFuZWwtcHJldmlldy10aGVtZXNcIj48L2Rpdj5cblx0XHRcdFx0XHQ8L1BhbmVsQm9keT5cblx0XHRcdFx0XHQ8UGFuZWxCb2R5IGNsYXNzTmFtZT1cIndwZm9ybXMtZ3V0ZW5iZXJnLXBhbmVsIGRpc2FibGVkX3BhbmVsXCIgdGl0bGU9eyBzdHJpbmdzLmZpZWxkX3N0eWxlcyB9PlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJ3cGZvcm1zLXBhbmVsLXByZXZpZXcgd3Bmb3Jtcy1wYW5lbC1wcmV2aWV3LWZpZWxkXCI+PC9kaXY+XG5cdFx0XHRcdFx0PC9QYW5lbEJvZHk+XG5cdFx0XHRcdFx0PFBhbmVsQm9keSBjbGFzc05hbWU9XCJ3cGZvcm1zLWd1dGVuYmVyZy1wYW5lbCBkaXNhYmxlZF9wYW5lbFwiIHRpdGxlPXsgc3RyaW5ncy5sYWJlbF9zdHlsZXMgfT5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwid3Bmb3Jtcy1wYW5lbC1wcmV2aWV3IHdwZm9ybXMtcGFuZWwtcHJldmlldy1sYWJlbFwiPjwvZGl2PlxuXHRcdFx0XHRcdDwvUGFuZWxCb2R5PlxuXHRcdFx0XHRcdDxQYW5lbEJvZHkgY2xhc3NOYW1lPVwid3Bmb3Jtcy1ndXRlbmJlcmctcGFuZWwgZGlzYWJsZWRfcGFuZWxcIiB0aXRsZT17IHN0cmluZ3MuYnV0dG9uX3N0eWxlcyB9PlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJ3cGZvcm1zLXBhbmVsLXByZXZpZXcgd3Bmb3Jtcy1wYW5lbC1wcmV2aWV3LWJ1dHRvblwiPjwvZGl2PlxuXHRcdFx0XHRcdDwvUGFuZWxCb2R5PlxuXHRcdFx0XHRcdDxQYW5lbEJvZHkgY2xhc3NOYW1lPVwid3Bmb3Jtcy1ndXRlbmJlcmctcGFuZWwgZGlzYWJsZWRfcGFuZWxcIiB0aXRsZT17IHN0cmluZ3MuY29udGFpbmVyX3N0eWxlcyB9PlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJ3cGZvcm1zLXBhbmVsLXByZXZpZXcgd3Bmb3Jtcy1wYW5lbC1wcmV2aWV3LWNvbnRhaW5lclwiPjwvZGl2PlxuXHRcdFx0XHRcdDwvUGFuZWxCb2R5PlxuXHRcdFx0XHRcdDxQYW5lbEJvZHkgY2xhc3NOYW1lPVwid3Bmb3Jtcy1ndXRlbmJlcmctcGFuZWwgZGlzYWJsZWRfcGFuZWxcIiB0aXRsZT17IHN0cmluZ3MuYmFja2dyb3VuZF9zdHlsZXMgfT5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwid3Bmb3Jtcy1wYW5lbC1wcmV2aWV3IHdwZm9ybXMtcGFuZWwtcHJldmlldy1iYWNrZ3JvdW5kXCI+PC9kaXY+XG5cdFx0XHRcdFx0PC9QYW5lbEJvZHk+XG5cdFx0XHRcdDwvRnJhZ21lbnQ+XG5cdFx0XHQpO1xuXHRcdH1cblxuXHRcdGlmICggISBoYXNGb3JtcygpICkge1xuXHRcdFx0anN4ID0gWyBwcmludEVtcHR5Rm9ybXNOb3RpY2UoIHByb3BzLmNsaWVudElkICkgXTtcblxuXHRcdFx0anN4LnB1c2goIGdldEVtcHR5Rm9ybXNQcmV2aWV3KCBwcm9wcyApICk7XG5cdFx0XHRyZXR1cm4ganN4O1xuXHRcdH1cblxuXHRcdGpzeCA9IFtcblx0XHRcdDxJbnNwZWN0b3JDb250cm9scyBrZXk9XCJ3cGZvcm1zLWd1dGVuYmVyZy1mb3JtLXNlbGVjdG9yLWluc3BlY3Rvci1jb250cm9sc1wiPlxuXHRcdFx0XHQ8UGFuZWxCb2R5IHRpdGxlPXsgd3Bmb3Jtc19ndXRlbmJlcmdfZm9ybV9zZWxlY3Rvci5zdHJpbmdzLmZvcm1fc2V0dGluZ3MgfT5cblx0XHRcdFx0XHQ8U2VsZWN0Q29udHJvbFxuXHRcdFx0XHRcdFx0bGFiZWw9eyB3cGZvcm1zX2d1dGVuYmVyZ19mb3JtX3NlbGVjdG9yLnN0cmluZ3MuZm9ybV9zZWxlY3RlZCB9XG5cdFx0XHRcdFx0XHR2YWx1ZT17IGZvcm1JZCB9XG5cdFx0XHRcdFx0XHRvcHRpb25zPXsgZm9ybU9wdGlvbnMgfVxuXHRcdFx0XHRcdFx0b25DaGFuZ2U9eyBzZWxlY3RGb3JtIH1cblx0XHRcdFx0XHQvPlxuXHRcdFx0XHRcdDxUb2dnbGVDb250cm9sXG5cdFx0XHRcdFx0XHRsYWJlbD17IHdwZm9ybXNfZ3V0ZW5iZXJnX2Zvcm1fc2VsZWN0b3Iuc3RyaW5ncy5zaG93X3RpdGxlIH1cblx0XHRcdFx0XHRcdGNoZWNrZWQ9eyBkaXNwbGF5VGl0bGUgfVxuXHRcdFx0XHRcdFx0b25DaGFuZ2U9eyB0b2dnbGVEaXNwbGF5VGl0bGUgfVxuXHRcdFx0XHRcdC8+XG5cdFx0XHRcdFx0PFRvZ2dsZUNvbnRyb2xcblx0XHRcdFx0XHRcdGxhYmVsPXsgd3Bmb3Jtc19ndXRlbmJlcmdfZm9ybV9zZWxlY3Rvci5zdHJpbmdzLnNob3dfZGVzY3JpcHRpb24gfVxuXHRcdFx0XHRcdFx0Y2hlY2tlZD17IGRpc3BsYXlEZXNjIH1cblx0XHRcdFx0XHRcdG9uQ2hhbmdlPXsgdG9nZ2xlRGlzcGxheURlc2MgfVxuXHRcdFx0XHRcdC8+XG5cdFx0XHRcdFx0PHAgY2xhc3NOYW1lPVwid3Bmb3Jtcy1ndXRlbmJlcmctcGFuZWwtbm90aWNlIHdwZm9ybXMtd2FybmluZ1wiPlxuXHRcdFx0XHRcdFx0PHN0cm9uZz57IHN0cmluZ3MudXBkYXRlX3dwX25vdGljZV9oZWFkIH08L3N0cm9uZz5cblx0XHRcdFx0XHRcdHsgc3RyaW5ncy51cGRhdGVfd3Bfbm90aWNlX3RleHQgfSA8YSBocmVmPXsgc3RyaW5ncy51cGRhdGVfd3Bfbm90aWNlX2xpbmsgfSByZWw9XCJub3JlZmVycmVyXCIgdGFyZ2V0PVwiX2JsYW5rXCI+eyBzdHJpbmdzLmxlYXJuX21vcmUgfTwvYT5cblx0XHRcdFx0XHQ8L3A+XG5cdFx0XHRcdDwvUGFuZWxCb2R5PlxuXHRcdFx0XHR7IGdldFN0eWxpbmdQYW5lbHNQcmV2aWV3KCkgfVxuXHRcdFx0PC9JbnNwZWN0b3JDb250cm9scz4sXG5cdFx0XTtcblxuXHRcdGlmICggZm9ybUlkICkge1xuXHRcdFx0cHJvcHMuc2V0QXR0cmlidXRlcyggeyBwYWdlVGl0bGU6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcuZWRpdG9yLXBvc3QtdGl0bGVfX2lucHV0JyApPy50ZXh0Q29udGVudCA/PyAnJyB9ICk7XG5cblx0XHRcdGpzeC5wdXNoKFxuXHRcdFx0XHQ8U2VydmVyU2lkZVJlbmRlclxuXHRcdFx0XHRcdGtleT1cIndwZm9ybXMtZ3V0ZW5iZXJnLWZvcm0tc2VsZWN0b3Itc2VydmVyLXNpZGUtcmVuZGVyZXJcIlxuXHRcdFx0XHRcdGJsb2NrPVwid3Bmb3Jtcy9mb3JtLXNlbGVjdG9yXCJcblx0XHRcdFx0XHRhdHRyaWJ1dGVzPXsgcHJvcHMuYXR0cmlidXRlcyB9XG5cdFx0XHRcdC8+XG5cdFx0XHQpO1xuXHRcdH0gZWxzZSBpZiAoIHByZXZpZXcgKSB7XG5cdFx0XHRqc3gucHVzaChcblx0XHRcdFx0PEZyYWdtZW50XG5cdFx0XHRcdFx0a2V5PVwid3Bmb3Jtcy1ndXRlbmJlcmctZm9ybS1zZWxlY3Rvci1mcmFnbWVudC1ibG9jay1wcmV2aWV3XCI+XG5cdFx0XHRcdFx0PGltZyBzcmM9eyB3cGZvcm1zX2d1dGVuYmVyZ19mb3JtX3NlbGVjdG9yLmJsb2NrX3ByZXZpZXdfdXJsIH0gc3R5bGU9eyB7IHdpZHRoOiAnMTAwJScgfSB9IGFsdD1cIlwiIC8+XG5cdFx0XHRcdDwvRnJhZ21lbnQ+XG5cdFx0XHQpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRqc3gucHVzaChcblx0XHRcdFx0PFBsYWNlaG9sZGVyXG5cdFx0XHRcdFx0a2V5PVwid3Bmb3Jtcy1ndXRlbmJlcmctZm9ybS1zZWxlY3Rvci13cmFwXCJcblx0XHRcdFx0XHRjbGFzc05hbWU9XCJ3cGZvcm1zLWd1dGVuYmVyZy1mb3JtLXNlbGVjdG9yLXdyYXBcIj5cblx0XHRcdFx0XHQ8aW1nIHNyYz17IHdwZm9ybXNfZ3V0ZW5iZXJnX2Zvcm1fc2VsZWN0b3IubG9nb191cmwgfSBhbHQ9XCJcIiAvPlxuXHRcdFx0XHRcdDxTZWxlY3RDb250cm9sXG5cdFx0XHRcdFx0XHRrZXk9XCJ3cGZvcm1zLWd1dGVuYmVyZy1mb3JtLXNlbGVjdG9yLXNlbGVjdC1jb250cm9sXCJcblx0XHRcdFx0XHRcdHZhbHVlPXsgZm9ybUlkIH1cblx0XHRcdFx0XHRcdG9wdGlvbnM9eyBmb3JtT3B0aW9ucyB9XG5cdFx0XHRcdFx0XHRvbkNoYW5nZT17IHNlbGVjdEZvcm0gfVxuXHRcdFx0XHRcdC8+XG5cdFx0XHRcdDwvUGxhY2Vob2xkZXI+XG5cdFx0XHQpO1xuXHRcdH1cblxuXHRcdHJldHVybiBqc3g7XG5cdH0sXG5cdHNhdmUoKSB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH0sXG59ICk7XG4iXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxJQUFBQSxHQUFBLEdBQWdGQyxFQUFFO0VBQUFDLG9CQUFBLEdBQUFGLEdBQUEsQ0FBMUVHLGdCQUFnQjtFQUFFQyxnQkFBZ0IsR0FBQUYsb0JBQUEsY0FBR0QsRUFBRSxDQUFDSSxVQUFVLENBQUNELGdCQUFnQixHQUFBRixvQkFBQTtBQUMzRSxJQUFBSSxXQUFBLEdBQW9DTCxFQUFFLENBQUNNLE9BQU87RUFBdENDLGFBQWEsR0FBQUYsV0FBQSxDQUFiRSxhQUFhO0VBQUVDLFFBQVEsR0FBQUgsV0FBQSxDQUFSRyxRQUFRO0FBQy9CLElBQVFDLGlCQUFpQixHQUFL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
},{}]},{},[1])