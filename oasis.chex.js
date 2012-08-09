/*
 *	Oasis Chex
 */

 var Oasis = {};

;(function(global) { var

	doc = document,
	namespace = Oasis,
	EL = {
		container: '<div id="oasis-chex-container"/>',
		items_box: '<div id="oasis-chex-items"/>',
		closer: '<div id="oasis-chex-closer">x Close</div>',
		title_bar: '<div class="oasis-chex-title"/>',
		button: '<button class="oasis-chex-button" type="button"/>'
	},
	TXT = {
		container: '#oasis-chex-container',
		item: '.oasis-chex-item',
		selected_class: 'selected'
	}

	// construct
	var _class = function(element, options) { this.init(element, options); };
	namespace.Chex = _class;

	// public
	_class.prototype = {

		init: function(element, options) { var
			self = this;

			this.element = element;
			this.options = $.extend({
				title: "Select Your Options",
				buttonText: "Select Your Options"
			}, options || {});

			this.$window = $(global);
			this.body = $('body');
			this.checkboxes = $('input:checkbox', this.element);
			this.container = $(EL.container);
			this.box = $(EL.items_box);
			this.closer = $(EL.closer);
			this.title_bar = $(EL.title_bar);
			this.button = $(EL.button);

			this.buildContainer();

			this.items = $(TXT.item);

			this.addEventListeners();
		},

		buildContainer: function() { var
			html = '';

			this.element.wrap(this.container).hide();
			this.container = $(TXT.container);
			this.container.append(this.button);

			// Build container children
			this.container.append(this.box);
			this.box.append(this.closer);
			this.box.append(this.title_bar);
			this.title_bar.html(this.options.title);
			this.button.html(this.options.buttonText);

			// Add spans to represent checkboxes
			this.checkboxes.each(function(i, item) {
				var $item = $(item);
				html += '<span class="oasis-chex-item '+($item.prop('checked') ? 'selected' : '')+'" data-name="'+$item.attr('name')+'">'+$item.data('name')+'</span>';
			});
			this.box.append(html);
		},

		addEventListeners: function() {
			this.items
				.bind('click', $.proxy(this.selectItem, this));

			this.button
				.bind('click', $.proxy(this.toggleChex, this));

			this.closer
				.bind('click', $.proxy(this.toggleChex, this));
		},

		selectItem: function(e) { var
			$this = $(e.target);

			if ($this.hasClass(TXT.selected_class)) {
				$this.removeClass(TXT.selected_class);
				this.checkboxes.each(function(i, item) { var
					$item = $(item);
					if ($item.attr('name') == $this.data('name'))
						$item.prop('checked', false);
				});
			} else {
				$this.addClass(TXT.selected_class);
				this.checkboxes.each(function(i, item) { var
					$item = $(item);
					if ($item.attr('name') == $this.data('name'))
						$item.prop('checked', true);
				});
			}
		},

		toggleChex: function(e) {
			if (this.box.is(':visible'))
				this.hideChex();
			else
				this.showChex(e);
		},

		showChex: function(e) { var
			self = this,
			shown = true;

			this.box.slideDown('fast');
			
			e.stopPropagation();
			$(document).bind('click', function(e) { var
				item = $(e.target);

				if (item.parents(TXT.container).length > 0) return;

				self.box.slideUp('fast');
				$(document).unbind('click');
			});
		},

		hideChex: function() {
			this.box.slideUp('fast');
		}
	};

})(window);
