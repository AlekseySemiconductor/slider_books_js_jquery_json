;$(document).ready(function(){

	$.getJSON('test.json', function(arr){

		for (var i=0; i<arr.length; i++){
			var picture = arr[i].picture;
			var name = arr[i].name;
			var authorFirst = arr[i].author.first;
			var authorLast = arr[i].author.last;
			var price = arr[i].price;
			var discount = arr[i].discount;
			var createDiv = $('.mySlider .mainContainer')
				.append(
					'<div class="number'+i+'">
						<div class="pic"></div>
						<h1 class="name"></h1>
						<p class="author"></p>
						<p class="price"></p>
						<p class="discount"></p>
					</div>'
				);

			$('.mySlider .mainContainer div:nth-child('+(i+1)+') .pic').css({
				'height': '60%',
				'background-image': 'url('+picture+')',
				'background-repeat': 'no-repeat',
				'background-size': '100% 100%'
			});

			$('.mySlider .mainContainer div:nth-child('+(i+1)+') .name').text(name);
			$('.mySlider .mainContainer div:nth-child('+(i+1)+') .name').addClass('nameText');

			$('.mySlider .mainContainer div:nth-child('+(i+1)+') .author').text(authorFirst+' '+authorLast);
			$('.mySlider .mainContainer div:nth-child('+(i+1)+') .author').addClass('authorText');
			
			$('.mySlider .mainContainer div:nth-child('+(i+1)+') .price').text('Цена: '+price+' руб.');
			$('.mySlider .mainContainer div:nth-child('+(i+1)+') .price').addClass('priceText');

			if (arr[i].typediscount == "F"){
				$('.mySlider .mainContainer div:nth-child('+(i+1)+') .discount').text('Скидка: '+discount+' руб.');
			}else{
				$('.mySlider .mainContainer div:nth-child('+(i+1)+') .discount').text('Скидка: '+discount+' %');
			}
			$('.mySlider .mainContainer div:nth-child('+(i+1)+') .discount').addClass('discountText');

		}

		var width = $('.mySlider .mainContainer > div').outerWidth(true); // Ширина div с классом main с margin
		var divElem = $('.mySlider .mainContainer > div').length;

		$('.mySlider .mainContainer').width(width*divElem);

		$('.mySlider').css({
			'width': width*3, // Слайдер будет по три картинки показывать
			'overflow': 'hidden'
		});

		// Делаем слайдер
		$('.mySlider .mainContainer').css('left', -width);
		$('.mainContainer > div:last-child').prependTo('.mySlider .mainContainer');

		function nextPic(){

			$('.mySlider .mainContainer').animate({
				'margin-left': -width
			}, 500, function(){
				$('.mainContainer > div:first-child').appendTo('.mySlider .mainContainer');
				$('.mySlider .mainContainer').css('margin-left', 0);
			});

		}

		function prevPic(){
			$('.mySlider .mainContainer').animate({
				'margin-left': width
			}, 500, function(){
				$('.mainContainer > div:last-child').prependTo('.mySlider .mainContainer');
				$('.mySlider .mainContainer').css('margin-left', 0);
			});
		}

		$('.mySlider .arrowRight').on('click', nextPic);
		$('.mySlider .arrowLeft').on('click', prevPic);

		$('.mainContainer > div').on('click', function(){

			var className = $(this).attr('class'); // Получили строку всех классов
			var numberPosition = /number\d+/; // \d - это цифры от 0 до 9, + - это от 1 и до бесконечности
			var word = className.match(numberPosition); // Из этой строки находим number+цифра, получаем массив, в котором сидит одно слово - наша строка
			var toStr = word.shift(); // Получаем первый и единственный элемент этого массива
			var index = toStr.slice(6); // Цифры начинаются с 7-ого элемента
			var isActive = arr[index].isActive;
			var clickedName = arr[index].name;
			var priceWithoutDiscount = +arr[index].price; // + нужен для того, чтобы переводить строку в число
			var discountP; // Скидка процентная
			var discountF; // Скидка фиксированная
			var priceWithDiscountP; // Цена, включая процентную скидку
			var priceWithDiscountF; // Цена, включая фиксированную скидку


			if (arr[index].typediscount === 'P'){
				discountP = Math.round((priceWithoutDiscount*arr[index].discount/100)*100)/100; // Процентная скидка в рублях, округленная до сотых
				priceWithDiscountP = Math.round((priceWithoutDiscount-discountP)*100)/100; // Math.round((Число)*100)/100 - чтобы округлить до сотых
			}else if (arr[index].typediscount === 'F'){
				discountF = arr[index].discount;
				priceWithDiscountF = priceWithoutDiscount-discountF;
			}

			
			var allSum; // Сумма со скидкой всех выделенных товаров, которые имеются в наличие (в начале она равна нулю)
			var allDiscount; // Сумма всех скидок
			var allSumWD; // Сумма без скидки всех выделенных товаров, которые имеются в наличие 
			if ($(this).hasClass('clicked')){
				$(this).removeClass('clicked');
				if (isActive === true){
					$('.table .'+index+'').remove();
					if (arr[index].typediscount === 'P') {
						allSum = parseFloat($('.table .allSum').text()) - parseFloat(priceWithDiscountP);
						allSum = Math.round(allSum*100)/100;
						$('.table .allSum').text(allSum);
						allDiscount = parseFloat($('.table .allDiscount').text()) - parseFloat(discountP);
						allDiscount = Math.round(allDiscount*100)/100;
						$('.table .allDiscount').text(allDiscount);
						allSumWD = parseFloat($('.table .allSumWD').text()) - parseFloat(discountP) - parseFloat(priceWithDiscountP);
						allSumWD = Math.round(allSumWD*100)/100;
						$('.table .allSumWD').text(allSumWD);
					} else if (arr[index].typediscount === 'F') {
						allSum = parseFloat($('.table .allSum').text()) - parseFloat(priceWithDiscountF);
						allSum = Math.round(allSum*100)/100;
						$('.table .allSum').text(allSum);
						allDiscount = parseFloat($('.table .allDiscount').text()) - parseFloat(discountF);
						allDiscount = Math.round(allDiscount*100)/100;
						$('.table .allDiscount').text(allDiscount);
						allSumWD = parseFloat($('.table .allSumWD').text()) - parseFloat(discountF) - parseFloat(priceWithDiscountF);
						allSumWD = Math.round(allSumWD*100)/100;
						$('.table .allSumWD').text(allSumWD);
					}
					if ($('.table tr').length == 4){
						$('.table').css('display', 'none');
					}
				}
			}else{
				$(this).addClass('clicked');
				if (isActive === true){
					$('.table').css('display', 'block');
					if (arr[index].typediscount === 'P'){
						$('.table tr:first-child').after(
							'<tr class="'+index+'">
								<td>'+clickedName+'</td><td>'+priceWithDiscountP+' руб.</td>
							</tr>'
						);
						if ($('.table .allSum').text() == ''){
							allSum = 0;
							allSum = allSum + priceWithDiscountP;
							$('.table .allSum').text(allSum);
							allDiscount = 0;
							allDiscount = allDiscount + discountP;
							$('.table .allDiscount').text(allDiscount); // Если nth-last-child(3) пуст, то и nth-last-child(2) тоже пуст, поэтому для него отдельный цикл писать нет смысла
							allSumWD = 0;
							allSumWD = allSumWD + discountP + priceWithDiscountP;
							$('.table .allSumWD').text(allSumWD);
						}else{
							allSum = parseFloat($('.table .allSum').text()) + parseFloat(priceWithDiscountP);
							allSum = Math.round(allSum*100)/100;
							$('.table .allSum').text(allSum);
							allDiscount = parseFloat($('.table .allDiscount').text()) + parseFloat(discountP);
							allDiscount = Math.round(allDiscount*100)/100;
							$('.table .allDiscount').text(allDiscount);
							allSumWD = parseFloat($('.table .allSumWD').text()) + parseFloat(discountP) + parseFloat(priceWithDiscountP);
							allSumWD = Math.round(allSumWD*100)/100;
							$('.table .allSumWD').text(allSumWD);
						}
					}else{
						$('.table tr:first-child').after(
							'<tr class="'+index+'">
								<td>'+clickedName+'</td><td>'+priceWithDiscountF+' руб.</td>
							</tr>'
						);
						if ($('.table .allSum').text() == ''){
							allSum = 0;
							allSum = allSum + priceWithDiscountF;
							$('.table .allSum').text(allSum);
							allDiscount = 0;
							allDiscount = allDiscount + discountF;
							$('.table .allDiscount').text(allDiscount);
							allSumWD = 0;
							allSumWD = allSumWD + discountF + priceWithDiscountF;
							$('.table .allSumWD').text(allSumWD);
						}else{
							allSum = parseFloat($('.table .allSum').text()) + parseFloat(priceWithDiscountF);
							allSum = Math.round(allSum*100)/100;
							$('.table .allSum').text(allSum);
							allDiscount = parseFloat($('.table .allDiscount').text()) + parseFloat(discountF);
							allDiscount = Math.round(allDiscount*100)/100;
							$('.table .allDiscount').text(allDiscount);
							allSumWD = parseFloat($('.table .allSumWD').text()) + parseFloat(discountF) + parseFloat(priceWithDiscountF);
							allSumWD = Math.round(allSumWD*100)/100;
							$('.table .allSumWD').text(allSumWD);
						}
					}
				}
			}

		});

	});

});