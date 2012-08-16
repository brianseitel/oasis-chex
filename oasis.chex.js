/*
 *	Oasis Chex
 */

 var Oasis = {};

;(function(global) { var

	doc = document,
	namespace = Oasis,
	EL = {
		button: '<button class="oasis-chex-button" type="button"/>',
		closer: '<div id="oasis-chex-closer">x Close</div>',
		container: '<div id="oasis-chex-container"/>',
		display_box: '<div id="oasis-chex-display"/>',
		display_item: '<div class="oasis-chex-display-item"/>',
		group_bar: '<div class="oasis-chex-group-bar"/>',
		items_box: '<div id="oasis-chex-items"/>',
		title_bar: '<div class="oasis-chex-title"/>'
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
			this.button = $(EL.button);
			this.closer = $(EL.closer);
			this.display_box = $(EL.display_box);
			this.display_items = {};
			this.group_bar = $(EL.group_bar);
			this.group_items = $('.oasis-chex-display-item');
			this.title_bar = $(EL.title_bar);

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
			this.container.append(this.display_box);
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

				html += '<span class="oasis-chex-item '+($item.prop('checked') ? 'selected' : '')+'" data-id="'+i+'" data-group="'+group+'" data-name="'+$item.attr('name')+'">'+$item.data('name')+'</span>';
			});
			this.box.append(html);
		},

		addEventListeners: function() {
			this.items
				.bind('click', $.proxy(this.selectItem, this))
				.bind('click', $.proxy(this.toggleItem, this));

			this.button
				.bind('click', $.proxy(this.toggleChex, this));

			this.closer
				.bind('click', $.proxy(this.toggleChex, this));

			this.group_items
				.bind('click', $.proxy(this.switchGroup, this));
		},

		selectItem: function(e) { var
			$this = $(e.target),
			self = this;

			if ($this.hasClass(TXT.selected_class)) {
				$this.removeClass(TXT.selected_class);
				this.checkboxes.each(function(i, item) { var
					$item = $(item);
					if ($item.attr('name') == $this.data('name')) {
						$item.prop('checked', false);
						$.proxy(self.toggleItem, self);
					}
				});
			} else {
				$this.addClass(TXT.selected_class);
				this.checkboxes.each(function(i, item) { var
					$item = $(item);
					if ($item.attr('name') == $this.data('name')) {
						$item.prop('checked', true);
					}
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

		toggleItem: function(e) { var
			id = $(e.target).data('id'),
			selected = $(e.target).hasClass('selected');
			selected_item = null;

			if (this.display_items.length) {
				this.display_items.each(function(i, item) {
					if (!selected_item) {
						var $item = $(item);
						if ($item.data('id') == id)
							selected_item = $item;
					}
				});
			}

			if (selected_item && !selected)
				this.hideItem(selected_item);
			else
				this.showItem(e);
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

		showItem: function(e) { var
			item = $(EL.display_item),
			$item = $(e.target),
			id = $item.data('id'),
			html = $item.html();

			item
				.attr('data-id', id)
				.html(html);

			this.display_box.append(item);
			this.display_items = $('.oasis-chex-display-item');
		},

		hideChex: function() {
			this.box.slideUp('fast');
		},

		hideItem: function(target) { 
			$(target).remove();
			this.display_items = $('.oasis-chex-display-item');

		}
	};

})(window);
