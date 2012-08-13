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
		button: '<button class="oasis-chex-button" type="button"/>',
		group_bar: '<div class="oasis-chex-group-bar"/>'
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
			this.timestamp = new Date().getTime();
			this.options = $.extend({
				title: "Select Your Options",
				buttonText: "Select Your Options"
			}, options || {});

			this.$window = $(global);
			this.body = $('body');
			this.groups = $('[rel=chex-group]', this.element);
			this.checkboxes = $('input:checkbox', this.element);
			this.container = $(EL.container);
			this.box = $(EL.items_box);
			this.closer = $(EL.closer);
			this.title_bar = $(EL.title_bar);
			this.button = $(EL.button);
			this.group_bar = $(EL.group_bar);
			this.group_items = null;

			this.buildContainer();

			this.items = $('.oasis-chex-item', this.container);

			this.addEventListeners();
		},

		buildContainer: function() { var
			html = '';

			this.element.wrap('<div id="oasis-chex-container-'+this.timestamp+'" class="oasis-chex-container"/>').hide();
			this.container = $('#oasis-chex-container-'+this.timestamp);
			this.container.append(this.button);

			// Build container children
			this.container.append(this.box);
			this.box.append(this.closer);
			this.box.append(this.title_bar);
			this.title_bar.html(this.options.title);
			this.button.html(this.options.buttonText);

			if (this.groups.length) {
				var bar = this.group_bar;
				this.groups.each(function(i, item){
					var title = $(item).data('title'),
					li = $('<li/>')
							.data('group', title)
							.addClass('oasis-chex-group')
							.html(title);
					bar.append(li);
				});
				this.box.append(this.group_bar);
			}

			this.group_items = $('.oasis-chex-group', this.container);

			// Add spans to represent checkboxes
			this.checkboxes.each(function(i, item) {
				var $item = $(item),
					par = $item.closest('[rel=chex-group]'),
					group = par.length ? par.data('title') : '';

				html += '<span class="oasis-chex-item '+($item.prop('checked') ? 'selected' : '')+'" data-group="'+group+'" data-name="'+$item.attr('name')+'">'+$item.data('name')+'</span>';
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

			this.group_items
				.bind('click', $.proxy(this.switchGroup, this));
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

		switchGroup: function(e) { var
			$this = $(e.target),
			title = $this.html();

			this.group_items.removeClass('selected');

			$this.addClass('selected');
			this.items.each(function(i, item) {
				var $item = $(item);

				if ($item.data('group') == title)
					$item.show();
				else
					$item.hide();
			});
		},

		toggleChex: function(e) {
			this.group_items.first().click();
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

				if (item.parents('.oasis-chex-container').length > 0) return;

				self.box.slideUp('fast');
				$(document).unbind('click');
			});
		},

		hideChex: function() {
			this.box.slideUp('fast');
		}
	};

})(window);
