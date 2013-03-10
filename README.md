===============
Inputmask Multi
===============
This plugin has developed for jQuery and allows to select a mask of input basing on the beginning of entered phone number. This technique allows to decrease errors on typing a phone number and make it more simple. Moreover this plugin can be used in other fields where rules of input can be presented as multiple masks of input.
# Introduсtion
It’s very often web sites require to enter a phone number. In our days every country has their own rules for dialing and lengths of numbers. As a result people from different countries confused about giving their numbers each other: one of them give a number started from a figure _8_, another one - from _0_ and third - from _+_.
# Review of existing solutions
To solve the problem described above and unify a format of phone numbers 3 main solutions are available:

1. Suggest to enter a phone number using a mask of input. Advantage: A demonstrative display of a phone number decreases errors on typing. Disadvantage: every country has their own rules of writing a phone number and it has a different length.

2. Suggest to select a country and type a remaining part of a phone number; it’s also possible to use a mask of input for a remaining part of a phone number. Advantage: possibility to use a different mask of input for every country (and every region inside a country). Disadvantages: a list of countries (and regions inside every country) can be large; a number becomes separated into 2 parts (an additional pre-processing before saving and displaying a phone number is required).

3. Add a figure _+_ before a phone number (outside of an input) and allow to type only digits. Advantage: it’s simple to make. Disadvantage: a demonstrative display of a phone number is absent.

# The solution
As a result was decided to improve a usual mask of input to change it depending on a phone number which has typed. Moreover is suggested to show the name of a country (a region) which is determined while a phone number is typing. Subjectively, this approach has to solve all problems which is described above.

Taking into account the number of countries in the world it was decided to collect a list of masks of input for all countries. As a source of rules of phone numbering was used [the information](http://www.itu.int/oth/T0202.aspx?parent=T0202) which is published on the web site of International Telecommunication Union.

A collecting process of this information was confused. It was important to take into account all possible cases of phone numbers including differences inside every country. Because of a large amount of information which had processed by hand it is possible that collected data contains inaccuracies. It is planned to apply fixes into this one over time.

# The implementation
As a core was used the implementation of [jquery.inputmask](https://github.com/RobinHerbots/jquery.inputmask). This plugin continues to develop and was designed to make it possible to write extensions for it. But in this task it was impossible to write an extension. I have decided not to involve or rewrite a source code of the core to avoid any conflicts during applying my patches into the source project because of it continues to develop. Therefore I had to write a superstructure of the core to monitor (and to interrupt) external events to change the data. To embed a handler of external events before the core was used a plugin [jquery.bind-first](https://github.com/private-face/jquery.bind-first).

## Sorting masks of input which are allowed
To select a mask of input which matches to a phone number more than others a list of all possible masks has to be sorted in a special way. During a thinking of rules were accepted the following definitions:

1. All symbols in a mask were segmented into 2 types: significant symbols (in my case it is the symbol `#` which matches any digit, and digits `0-9`) and symbols-decorators (all others).

2. Another segmentation of symbols in a mask of input is templated symbols (in my case it is a symbol `#`) and others.

As a result the following rules of sorting in the order of applying were written:

1. When comparing 2 masks of input per symbols only significant symbols (not decorators) is taken into account.

2. Different templated symbols are taken as equivalents, another significant symbols are compared based on their codes.

3. Non-templated symbols are always less than templated one and they located above in a result.

4. The shorter a length of significant characters in a mask of input, the mask of input is smaller and is located above in a result.

## Searching a mask of input which is matched

When comparing the input text with every mask of input in the sorted list only significant symbols are taken into account in the mask of input. If the text longer than the mask of input despite all previous symbols of the mask of input are matched, this mask is not matched. In case the input text is matched for multiple masks only first of them is returned. After that all significant symbols (including non-templated) in the mask which was found is replaced by templated one which is combines all symbols which are allowed by any templated symbol.

## Processing and handling of events

To avoid any conflicts with handlers of the core the following events is interrupted:

* **keydown** - a pressing of keys Backspace and Delete is monitored - to change the current mask of input before the core handler will delete a one symbol from the text. Moreover pressing of the key Insert is also monitored to change the mode of input for synchronization.

* **keypress** - as a symbol which is typed can be not allowed by original mask of input (because all significant symbols were replaced by templated) is required to check the new text for matching of allowed masks of input. If a matched mask is not found the typed symbol is canceled, else the current mask of input is changed and this event transfers to the core.

* **paste**, **input** - pasting a text from the clipboard. Before transferring the event to the core searching the mask for the new text is made. If the mask of input was not found the text is cutting from the end per symbol while the mask which is matched for cutted text is not found. This approach is used after change the text by val() function and on initializing if the text of input is not empty too.

* **dragdrop**, **drop** - processing is equal to paste.

* **blur** - additional processing for the case when the mode of clearing the input if it not matches for mask of input on losing focus is active. This event handles after the core in contrast of another ones.

All events is handled in the space _inputmask_. It allows to avoid wrong actions on calling the inputmask method after initializing this plugin (because the initialization of the core cancels another handlers in the space _inputmask_).

# The sample of using
## The format of a list of masks
A list of masks is a Javascript array of objects with equal (or similar) set of properties. At least a property which is contains a mask of input must be available for all objects in array. The name of this property can be vary. The fragment of a list of masks is shown below:

	[
	…
		{ "mask": "+7(###)###-##-##", "cc": "RU", "name_en": "Russia", "desc_en": "", "name_ru": "Россия", "desc_ru": "" },
		{ "mask": "+250(###)###-###", "cc": "RW", "name_en": "Rwanda", "desc_en": "", "name_ru": "Руанда", "desc_ru": "" },
		{ "mask": "+966-5-####-####", "cc": "SA", "name_en": "Saudi Arabia ", "desc_en": "mobile", "name_ru": "Саудовская Аравия ", "desc_ru": "мобильные" },
		{ "mask": "+966-#-###-####", "cc": "SA", "name_en": "Saudi Arabia", "desc_en": "", "name_ru": "Саудовская Аравия", "desc_ru": "" },
	…
	]

## Parameters of connection of the plugin
Before using the plugin is required to sort a list of masks. It can be done by call the following function:

	$.masksSort = function(maskList, defs, match, key)

* **maskList** - the array of objects of masks of input (see above);
* **defs** - the array of templated symbols (in our case it’s a symbol `#`);
* **match** - the regular expression of significant symbols (in our case it’s `/[0-9]|#/`);
* **key** - the name of the property in the object of the array which is contains the mask of input.

On plugin initialization is transferred an object which is sets its work. This object contains the following set of parameters:
* **inputmask** - the object with parameters for core plugin;
* **match** - the regular expression of significant symbols except templated symbols;
* **replace** - the templated symbol which will be replaced all significant symbols by; can be absent in definitions object of inputmask object;
* **list** - the array of objects of masks of input;
* **listKey** - the name of the property in objects which is contains the mask of input;
* **onMaskChange** - the function (callback) which is called on update the current mask of input; 1st parameter is an object with fitted mask, 2nd parameter is accuracy of the new mask: true - the mask fits completely, false - it’s required another symbols to determine true mask.

To initialize the plugin is required to call inputmasks for an input field:
	$.fn.inputmasks = function(maskOpts, mode)
* **maskOpts** - the object which is sets the work of plugin;
* **mode** - optional; now it can has a value isCompleted - as a result the function returns true if text of input field is typed completely and false in other cases.

## The sample of using the plugin
	<input type="text" id="customer_phone" value="7" size="25"><br>
	<input type="checkbox" id="phone_mask" checked>
	<label id="descr" for="phone_mask">Маска ввода</label>
	<script>
		var maskList = $.masksSort($.masksLoad("phone-codes.json"), ['#'], /[0-9]|#/, "mask");
		var maskOpts = {
			inputmask: {
				definitions: {
					'#': {
						validator: "[0-9]",
						cardinality: 1
					}
				},
				//clearIncomplete: true,
				showMaskOnHover: false,
				autoUnmask: true
			},
			match: /[0-9]/,
			replace: '#',
			list: maskList,
			listKey: "mask",
			onMaskChange: function(maskObj, completed) {
				if (completed) {
					var hint = maskObj.name_ru;
					if (maskObj.desc_ru && maskObj.desc_ru != "") {
						hint += " (" + maskObj.desc_ru + ")";
					}
					$("#descr").html(hint);
				} else {
					$("#descr").html("Маска ввода");
				}
				$(this).attr("placeholder", $(this).inputmask("getemptymask"));
			}
		};
	
		$('#phone_mask').change(function() {
			if ($('#phone_mask').is(':checked')) {
				$('#customer_phone').inputmasks(maskOpts);
			} else {
				$('#customer_phone').inputmask("+[####################]", maskOpts.inputmask)
				.attr("placeholder", $('#customer_phone').inputmask("getemptymask"));
				$("#descr").html("Маска ввода");
			}
		});
	
		$('#phone_mask').change();
	</script>

## The demonstration
The demonstration of this plugin is available on the [page](http://andr-04.github.com/inputmask-multi/) of the project.
