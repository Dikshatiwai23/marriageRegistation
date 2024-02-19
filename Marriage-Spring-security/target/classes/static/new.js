

var app = angular.module('AngularApp', []);



app.controller('MyCtrl', ['$scope', '$http', '$rootScope', '$timeout', 'personService', function($scope, $http, $rootScope, $timeout, personService) {
	/*var sleepForFiveSeconds = function() {
		console.log('Sleeping for 5 seconds...');

		// Use $timeout to introduce a delay of 5000 milliseconds (5 seconds)
		$timeout(function() {
			console.log('Awake after 5 seconds!');
			location.reload();
			// Perform any actions you want after the sleep
		}, 2000);
	};*/


	//=========================================Review Of normal user js=========================================//
	$scope.close = function() {
		$scope.table = false;

	}

	$scope.regi = false;
	$scope.Edit = function() {
		$scope.regi = true;
	}


	$scope.getCurrentDate = function() {


		var currentDate = new Date();
		var year = currentDate.getFullYear();
		var month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
		var day = currentDate.getDate().toString().padStart(2, '0');
		return `${year}-${month}-${day}`;
	}
	$scope.calculateAge = function() {
		if ($scope.review.dob) {
			var dob = new Date($scope.review.dob);
			var currentDate = new Date();
			var age = currentDate.getFullYear() - dob.getFullYear();

			if (currentDate.getMonth() < dob.getMonth() ||
				(currentDate.getMonth() === dob.getMonth() && currentDate.getDate() < dob.getDate())
			) {
				age--;
			}
			$scope.review.age = age;
		}
		if (age < 21) {
			// User is underage
			$scope.isUnderage = true;
		} else {
			// User is 18 or older, proceed with your logic
			$scope.isUnderage = false;
		}
	};

	$scope.Back = function() {
		console.log("back")
		$scope.regi = false;
	}
	$scope.UpdatePerson = function() {
		$http.put('/api/persons/' + $scope.review.id, $scope.review)
			.then(function(response) {
				console.log('Server response:', response.data);
			})
			.catch(function(error) {
				console.error('Error:', error);
			});
		Swal.fire({

			title: 'Updated Successfully!',
			text: 'Thank you!',
			icon: 'success',
			confirmButtonText: 'OK',
			allowOutsideClick: false

		}).then((result) => {

			console.log("gh")
			// Reload the page after the success message is closed by clicking "OK"
			location.reload();
		});

		$scope.regi = false;
	};

	$scope.gender = function() {
		$scope.regi = false;
		$scope.table = true;
		if ($scope.review.gender === "Male") {
			$scope.show = false;

			$http.get('/female') // Update the endpoint based on your backend API
				.then(function(response) {
					$scope.users = response.data;
				})
				.catch(function(error) {
					console.error('Error fetching data:', error);
				});
		}
		else if ($scope.review.gender === "Female") {
			$scope.show = false;
			$http.get('/male') // Update the endpoint based on your backend API
				.then(function(response) {

					$scope.users = response.data;
				})
				.catch(function(error) {
					console.error('Error fetching data:', error);
				});

		}
		else {

			$http.get('/trans') // Update the endpoint based on your backend API
				.then(function(response) {
					$scope.users = response.data;
				})
				.catch(function(error) {
					console.error('Error fetching data:', error);
				});
		}
	}


	$scope.open = function(id) {


		$http.get('/api/persons/' + id) // Update the endpoint based on your backend API
			.then(function(response) {
				$scope.review1 = response.data;



			})
			.catch(function(error) {
				console.error('Error fetching data:', error);
			});


	}
	//===================================================================================//

	//=======================================login js==========================================//
	$scope.userCaptcha = "";
	$scope.showError = false;
	$scope.errorMessage = "";

	$scope.showPassword = false;

	$scope.togglePasswordVisibility = function() {
		$scope.showPassword = !$scope.showPassword;
		var passwordInput = document.getElementById('pass');
		passwordInput.type = $scope.showPassword ? 'text' : 'password';
	};


	$scope.getCaptcha = function() {

		$http.get('/captcha')
			.then(function(response) {
				$scope.captchaId = response.data.captchaId;
				$scope.captcha = response.data.captcha;
			});
	}
	$scope.selectpan = function() {
		// Trigger click event on the file input
		document.getElementById('log').click();
	};

	$scope.getCaptcha();

	$scope.submitForm = function() {

		$http.post('/validate-captcha', { captchaId: $scope.captchaId, userCaptcha: $scope.userCaptcha })
			.then(function(response) {
				if (response.data.success) {
					//alert("Captcha is correct! Form submitted successfully.");
					$scope.showError = false;
					$scope.selectpan();

					$scope.getCaptcha(); // Get a new captcha after successful validation
				} else {
					$scope.showError = true;
					$scope.errorMessage = "Incorrect captcha. Please try again.";
					if (response.data.newCaptcha) {
						$scope.captcha = response.data.newCaptcha; // Update the captcha in UI
					}
				}
			});
	};
	//===================================================================================//
	//=======================================table js==========================================//


	$http.get('/getAllUsers') // Update the endpoint based on your backend API
		.then(function(response) {
			$scope.records = response.data;
			$scope.filteredUsers = $scope.records;

			// Use $timeout to initialize DataTable after the view is rendered
			$timeout(function() {
				$('#mytable').DataTable({
					"paging": true,
					"pageLength": 3,
					lengthMenu:[[3,6,9,-1],[3,6,9,"All"]],

					// Add other DataTables options as needed

					"drawCallback": function(settings) {
						var api = this.api();
						var pageInfo = api.page.info();
						$('#mytable_info').html('Showing ' + (pageInfo.start + 1) + ' to ' + pageInfo.end + ' only');
					}
				});
			});
		})
		.catch(function(error) {
			console.error('Error fetching data:', error);
		});




	/*	$http.get('/getAllUsers')
			.then(function (response) {




				$scope.records = response.data;
				$scope.filteredUsers = $scope.records;
			})
			.catch(function (error) {


				console.error('Error fetching data:', error);
			});*/




	$http.get('/getone')
		.then(function(response) {


			$scope.review = response.data;
		})
		.catch(function(error) {


			console.error('Error fetching data:', error);
		});

	$scope.viewFile = function(fileId) {
		// Use the fileId to construct the PDF file URL
		var pdfUrl = '/viewpdf/' + fileId;
		window.open(pdfUrl, '_blank');

	};

	$scope.filterData = function() {

		if ($scope.selectedGender) {
			// If a gender is selected, filter the users based on the selected gender
			$scope.filteredUsers = $scope.records.filter(function(user) {

				return user.gender === $scope.selectedGender;

			});
		} else {
			// If no gender is selected, show all users
			$scope.filteredUsers = $scope.records;
		}
		//  $scope.gendersel=$scope.selectedgender;
		// $scope.gendersel=$scope.selectedgender;
	};



	$scope.delete = function(id) {
		// Use SweetAlert for confirmation
		Swal.fire({
			title: 'Are you sure?',
			text: 'You won\'t be able to revert this!',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, delete it!'
		}).then((result) => {
			if (result.isConfirmed) {
				Swal.fire({
					title: 'Deleted!',
					text: 'Your entry has been deleted.',
					icon: 'success'
				}).then(() => {
					// Reload the page after SweetAlert is closed
					location.reload();
				});

				// If user clicks "Yes, delete it!" button
				$http.get('/delete/' + id)
					.then(function(response) {
						// Handle success, e.g., show another SweetAlert for success
						$scope.deleteResult = response.data;


					})
					.catch(function(error) {
						// Handle error, e.g., show another SweetAlert for error
						console.error('Error fetching data: 634', error);


					});
			}
		});
	};
	$scope.downloadExcel = function(input) {
		// Replace 'yourPassword' with the actual password you set in the server-side code
		var id = input;

		$http({
			method: 'GET',
			url: '/api/excel/download',
			responseType: 'arraybuffer',
			params: { id: id } // Send the password as a parameter
		})
			.then(function(response) {
				var blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
				var link = document.createElement('a');
				link.href = window.URL.createObjectURL(blob);
				link.download = 'people.xlsx';
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			})
			.catch(function(error) {
				console.error(error);
				alert("Error downloading Excel sheet");
			});
	};

	$scope.m = function() {

		$scope.gend = "g";
		$timeout(function() {

			console.log($scope.selectedGender);
			if ($scope.selectedGender === "") {
				$http.get('/data/' + $scope.gend) // Update the endpoint based on your backend API
					.then(function(response) {

						//$scope.users = response.data;
					})
					.catch(function(error) {
						console.error('Error fetching data:', error);
					});

			}
			else {
				$http.get('/data/' + $scope.selectedGender) // Update the endpoint based on your backend API
					.then(function(response) {

						//$scope.users = response.data;
					})
					.catch(function(error) {
						console.error('Error fetching data:', error);
					});

			}
		}, 500);

	}




	$scope.d = function() {
		$scope.dis = "d";

		$timeout(function() {

			console.log($scope.selectedDistrict);
			if ($scope.selectedDistrict === "") {
				$http.get('/data3/' + $scope.dis) // Update the endpoint based on your backend API
					.then(function(response) {
						//$scope.users = response.data;
					})
					.catch(function(error) {
						console.error('Error fetching data:', error);
					});

			}
			else {
				$http.get('/data3/' + $scope.selectedDistrict) // Update the endpoint based on your backend API
					.then(function(response) {
						//$scope.users = response.data;
					})
					.catch(function(error) {
						console.error('Error fetching data:', error);
					});
			}
			// $scope.selectedgender="h";

			// Perform any actions you want after the sleep
		}, 500);

	}




	$scope.u = function() {
		$scope.marri = "h";
		$timeout(function() {

			if ($scope.selectedMaritalStatus === "") {
				$http.get('/data2/' + $scope.marri) // Update the endpoint based on your backend API
					.then(function(response) {
						//	$scope.users = response.data;
					})
					.catch(function(error) {
						console.error('Error fetching data:', error);
					});
			}
			else {
				$http.get('/data2/' + $scope.selectedMaritalStatus) // Update the endpoint based on your backend API
					.then(function(response) {
						//	$scope.users = response.data;
					})
					.catch(function(error) {
						console.error('Error fetching data:', error);
					});
			}
			// Perform any actions you want after the sleep
		}, 1000);

	}
	//==================================================================================//
	//==========================================chart js=====================================//


	$scope.genderData = {
		male: 0,
		female: 0,
		transgender: 0
	};
	$scope.StatusData = {
		married: 0,
		single: 0,
		divorced: 0
	};



	$scope.fetchGenderCounts = function() {
		$http.get('/api/users/count-male').then(function(response) {
			$scope.genderData.male = response.data;
			$http.get('/api/users/count-female').then(function(response) {
				$scope.genderData.female = response.data;
				$http.get('/api/users/count-trans').then(function(response) {
					$scope.genderData.transgender = response.data;

					$scope.drawChart();
				}, function(error) {
					console.error('Error fetching female count:', error.data);
				});
			}, function(error) {
				console.error('Error fetching male count:', error.data);
			}, function(error) {
				console.error('Error fetching transgender count:', error.data);
			});
		});
	};
	$scope.fetchStatusCounts = function() {
		$http.get('/api/users/count-D').then(function(response) {
			$scope.StatusData.divorced = response.data;
			$http.get('/api/users/count-S').then(function(response) {
				$scope.StatusData.single = response.data;
				$http.get('/api/users/count-M').then(function(response) {
					$scope.StatusData.married = response.data;
					$scope.drawChart1();
				}, function(error) {
					console.error('Error fetching married count:', error.data);
				});
			}, function(error) {
				console.error('Error fetching single count:', error.data);
			});
		}, function(error) {
			console.error('Error fetching divorced count:', error.data);
		});
	};

	$scope.drawChart = function() {
		var chartContainer = document.getElementById('genderChartContainer');
		chartContainer.innerHTML = ''; // Clear previous content
		var canvas = document.createElement('canvas');
		canvas.width = 310;
		canvas.height = 310;
		chartContainer.appendChild(canvas);

		var ctx = canvas.getContext('2d');
		var chart = new Chart(ctx, {
			type: 'pie',
			data: {
				labels: ['Male', 'Female', 'Other'],
				datasets: [{
					data: [$scope.genderData.male, $scope.genderData.female, $scope.genderData.transgender],
					backgroundColor: [
						'rgba(75, 192, 192, 1)',
						'rgba(0,0,200, .2)',
						'rgba(255, 99, 132, 0.4)'
					],
					borderColor: [
						'rgba(75, 192, 192, 1)',
						'rgba(0,0,0,.2)',
						'rgba(255, 99, 132, 1)'
					],
					borderWidth: 1
				}]
			},
			options: {
				cutout: 0, // Set to 0 for a standard pie chart
				responsive: false, // Disable responsiveness
			}
		});
	};


	$scope.drawChart1 = function() {
		var chartContainer = document.getElementById('genderChartContainer1');
		chartContainer.innerHTML = ''; // Clear previous content
		var canvas = document.createElement('canvas');
		canvas.width = 300;
		canvas.height = 300;
		chartContainer.appendChild(canvas);

		var ctx = canvas.getContext('2d');
		var chart = new Chart(ctx, {
			type: 'pie',
			data: {
				labels: ['Divorced', 'Married', 'Single'],
				datasets: [{
					data: [$scope.StatusData.divorced, $scope.StatusData.married, $scope.StatusData.single],
					backgroundColor: [
						'rgba(75, 192, 192, 1)',
						'rgba(0,0,200, .2)',
						'rgba(255, 99, 132, 0.4)'
					],
					borderColor: [
						'rgba(75, 192, 192, .9)',
						'rgba(0,0,0,.2)',
						'rgba(255, 99, 132, 1)'
					],

					borderWidth: 1
				}]
			},
			options: {
				cutout: 0, // Set to 0 for a standard pie chart
				responsive: false, // Disable responsiveness
			}
		});
	};




	$scope.fetchGenderCounts();
	$scope.fetchStatusCounts();
	//=================================================================================//
	// main start
	$rootScope.ig = false;
	$rootScope.pp = false;
	$rootScope.aa = false;
	$rootScope.ttt = false;
	$rootScope.ww = false;



	$scope.showPassword = false;

	$scope.togglePasswordVisibility = function() {
		$scope.showPassword = !$scope.showPassword;
		var passwordInput = document.getElementById('pass');
		passwordInput.type = $scope.showPassword ? 'text' : 'password';
	};

	$scope.user = {};
	$scope.records = [];
	$scope.user.role = "ROLE_NORMAL"
	$scope.reviewedPerson = null;

	$scope.flag = false;
	$scope.show = false;


	$scope.urbanDistricts = ['Bhopal', 'Indore', 'Jabalpur', 'Rewa', 'Ujjain'];
	$scope.urbanCities = {
		'Indore': ['Indore', 'Rau', 'Sanwer', 'Malhargang', 'Mhow'],
		'Ujjain': ['Ujjain', 'Mahidpur', 'Nagda', 'Badnagr', 'Tarana'],
		'Rewa': ['Rewa', 'Semariya', 'Teonthar', 'Mangawan', 'Nai Garhi', 'Raipur Karchuliyan', 'Gangev'],
		'Jabalpur': ['Jabalpur', 'Sihora', 'Bilpura', 'Panagr', 'Majouli', 'Barela', 'Kundam'],
		'Bhopal': ['Bhopal', 'Berasiya', 'Phanda', 'Huzur']
	};

	$scope.ruralDistricts = ['Alirajpur', 'Barwani', 'Betul', 'Chhindwara', 'Raisen', 'Rajgarh'];
	$scope.ruralBlocks = {
		'Alirajpur': ['Alirajpur', 'Bharva', 'Jobat'],
		'Barwani': ['Barwani', 'Anjad', 'Niwali'],
		'Betul': ['Bhainsdehi', 'Betul', 'Amla'],
		'Chhindwara': ['Parasia', 'Chhindawara', 'Sausar'],
		'Rajgarh': ['Khilchipur', 'Biaora', 'Narsinghgarh', 'Sarangpur'],
		'Raisen': ['Begumganj', 'Gairatganj', 'Bareli', 'Goharganj', 'Silwani']

	};

	/* $scope.updateChart = function() {
		var user = {
			gender: $scope.selectedGender
		};
		$scope.fetchGenderCounts();
		 $http.post('/api/users', user).then(function () {
			  $scope.fetchGenderCounts();
		  }, function (error) {
			  console.error('Error adding user:', error.data);
		  });
		  
	};

	$scope.StatusChart = function() {
		var user = {
			status: $scope.selectedstatus
		};
		$scope.fetchStatusCounts();
	   $http.post('/api/users', user).then(function () {
			   $scope.fetchStatusCounts();
		   }, function (error) {
			   console.error('Error adding user:', error.data);
		   });

	};
*/
	//convert input in camelcase
	$scope.convertToCamelCase = function(input) {



		if (typeof input !== "string") {
			return input;
		}

		/*  return input
		   .replace(/([A-Z])/g, (match) => ` ${match}`)
		   .replace(/^./, (match) => match.toUpperCase());
	  */
		return input
			.toLowerCase()
			.replace(/\b\w/g, function(match) {
				return match.toUpperCase();
			});

	};




	//=======================================================================================//
	/*	$scope.logg=false;
	
	
	$http.get('/getone2')
					.then(function (response) {	$scope.hh = response.data;
					if($scope.hh.name==="pp"){
						$scope.logg=true;
					}
					if($scope.hh.name==="aa"){
						$scope.logg=false;
					}
	
					})
					.catch(function (error) {
	
	
						console.error('Error fetching data:', error);
					});
	*/
	/*$http.get('/getAllUsers')
		.then(function(response) {


			$scope.records = response.data;
		})
		.catch(function(error) {


			console.error('Error fetching data:', error);
		});*/

/// for eamil validation
	$scope.ffl = function() {
		$http.get('/getAllUsers')
			.then(function(response) {
				$scope.users = response.data;

				// Assuming you want to check for the presence of a variable called 'targetUser'
				var targetUser = $scope.user.email; // Replace with the variable you want to check

				// Using a for loop to check if targetUser is present in the response.data array
				var isUserPresent = false;
				for (var i = 0; i < $scope.users.length; i++) {
					if ($scope.users[i].email === targetUser) {
						isUserPresent = true;
						break;
					}
				}

				if (isUserPresent) {
					$scope.yes = true;
					$scope.user.email = null;
					console.log(targetUser + ' is present in the users array.');
				} else {
					$scope.yes = false;
					console.log(targetUser + ' is not present in the users array.');
				}
			})
			.catch(function(error) {
				console.error('Error fetching data:', error);
			});
	}


	$scope.getCurrentDate = function() {


		var currentDate = new Date();
		var year = currentDate.getFullYear();
		var month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
		var day = currentDate.getDate().toString().padStart(2, '0');
		return `${year}-${month}-${day}`;
	}

//for change area
	$scope.change = function() {

		// Reset fields when changing residence type

		$scope.user.block = '';
		$scope.user.district = '';
		$scope.user.city = '';
		$scope.user.gram = '';
	};


//for saving and updating feilds 
	$scope.idd = null;
	$scope.method = function() {

		if ($scope.idd != null) {
			$scope.updatePerson();
			console.log("update");
		}
		else {
			$scope.savePerson();
			console.log("save");
		}

		Swal.fire({
			icon: 'success',
			title: 'Information Saved!',
			text: 'Your information has been successfully saved.',
		});
		$scope.show = true;
	}


	$scope.calculateAge = function() {
		if ($scope.user.dob) {
			var dob = new Date($scope.user.dob);
			var currentDate = new Date();
			var age = currentDate.getFullYear() - dob.getFullYear();

			if (currentDate.getMonth() < dob.getMonth() ||
				(currentDate.getMonth() === dob.getMonth() && currentDate.getDate() < dob.getDate())
			) {
				age--;
			}
			$scope.user.age = age;
		}
		if (age < 21) {
			// User is underage
			$scope.isUnderage = true;
		} else {
			// User is 18 or older, proceed with your logic
			$scope.isUnderage = false;
		}
	};
	// $scope.s=false;



	$scope.Form = function() {


		if ($scope.user.name && $scope.user.dob && $scope.user.mobile && $scope.user.email &&
			$scope.user.maritalStatus && $scope.user.area && $scope.user.age >= 21 && $scope.user.gender && $scope.user.district &&
			$rootScope.ig && $rootScope.pp && $rootScope.aa && $rootScope.ttt && $rootScope.ww && $scope.user.pass) {

			$scope.user.name = $scope.convertToCamelCase($scope.user.name);


			if ($scope.user.area === 'Urban') {
				if ($scope.user.city && $scope.user.district) {
					$scope.method();


				}
				else {
					Swal.fire({
						icon: 'error',
						title: 'Error!',
						text: 'Please Fill city.',
						allowOutsideClick: false

					});
				}
			}



			if ($scope.user.area === 'Rural') {
				if ($scope.user.block && $scope.user.district && $scope.user.gram) {
					$scope.user.gram = $scope.convertToCamelCase($scope.user.gram);
					$scope.method();
				}
				else if (!$scope.user.block) {
					Swal.fire({
						icon: 'error',
						title: 'Error!',
						text: 'Please Fill block.',
						allowOutsideClick: false

					});
				}


				else {
					Swal.fire({
						icon: 'error',
						title: 'Error!',
						text: 'Please Fill Gram.',
						allowOutsideClick: false

					});
				}
			}




		}


		else if (!$scope.user.name) {

			Swal.fire({

				icon: 'error',
				title: 'Error!',
				text: 'Please Fill Name .',
				allowOutsideClick: false
			});
		}

		else if (!$scope.user.dob) {

			Swal.fire({

				icon: 'error',
				title: 'Error!',
				text: 'Please Fill DOB .',
				allowOutsideClick: false
			});
		}
		else if (!$scope.user.mobile) {

			Swal.fire({

				icon: 'error',
				title: 'Error!',
				text: 'Please Fill Mobile number.',
				allowOutsideClick: false
			});
		}
		else if (!$scope.user.pass) {

			Swal.fire({

				icon: 'error',
				title: 'Error!',
				text: 'Please Enter your password .',
				allowOutsideClick: false
			});
		}
		else if (!$scope.user.email) {

			Swal.fire({

				icon: 'error',
				title: 'Error!',
				text: 'Please Fill Email .',
				allowOutsideClick: false
			});
		}

		else if (!$scope.user.gender) {

			//alert("test");
			Swal.fire({

				icon: 'error',
				title: 'Error!',
				text: 'Please Fill Gender.',
				allowOutsideClick: false
			});
		}

		else if (!$scope.user.maritalStatus) {

			Swal.fire({

				icon: 'error',
				title: 'Error!',
				text: 'Please Fill Marital Status Feild.',
				allowOutsideClick: false
			});
		}

		else if (!$rootScope.ig) {

			Swal.fire({

				icon: 'error',
				title: 'Error!',
				text: 'Please Select Image .',
				allowOutsideClick: false
			});
		}
		else if (!$rootScope.pp) {

			Swal.fire({

				icon: 'error',
				title: 'Error!',
				text: 'Please Select PAN .',
				allowOutsideClick: false
			});
		}
		else if (!$rootScope.aa) {

			Swal.fire({

				icon: 'error',
				title: 'Error!',
				text: 'Please Select ADHAR .',
				allowOutsideClick: false
			});
		}
		else if (!$rootScope.ttt) {

			Swal.fire({

				icon: 'error',
				title: 'Error!',
				text: 'Please Select 10th Marksheet .',
				allowOutsideClick: false
			});
		}

		else if (!$rootScope.ww) {

			Swal.fire({

				icon: 'error',
				title: 'Error!',
				text: 'Please Select 12th marksheet .',
				allowOutsideClick: false
			});
		}
		else if (!$scope.user.area) {

			Swal.fire({

				icon: 'error',
				title: 'Error!',
				text: 'Please Fill Area.',
				allowOutsideClick: false
			});
		}
		else if (!$scope.user.district) {

			Swal.fire({

				icon: 'error',
				title: 'Error!',
				text: 'Please Fill District.',
				allowOutsideClick: false
			});
		}

		else {

			Swal.fire({

				icon: 'error',
				title: 'Error!',
				text: 'Please fill Feild.',
				allowOutsideClick: false
			});
		}



	}


//1st submiting
	$scope.savePerson = function() {
		personService.savePerson($scope.user)
			.then(function(response) {
				$scope.reviewedPersonId = response.data.id;
				$scope.idd = response.data.id;
				$scope.reviewPerson();
			})
			.catch(function(error) {
				console.error('Error saving person: ', error);
			});


	};





//updating

	$scope.updatePerson = function() {
		personService.updatePerson($scope.reviewedPersonId, $scope.user)
			.then(function(response) {
				console.log('Person updated successfully:', response.data);


				// Refresh the reviewed person details
				$scope.reviewPerson();
			})
			.catch(function(error) {
				console.error('Error updating person: ', error);
			});
	};

//for review after 1st time saving
	$scope.reviewPerson = function() {
		personService.getPersonById($scope.reviewedPersonId)
			.then(function(response) {
				$scope.reviewedPerson = response.data;
			})
			.catch(function(error) {
				console.error('Error fetching reviewed person: ', error);
			});
	};




	$scope.back = function() {

		$scope.show = false;

	}

// finale submission
	$scope.saveForm = function() {
		$http.post('/register', $scope.user)
			.then(function(response) {

				console.log('Server response:', response.data);

			})
			.catch(function(error) {
				console.error('Error:', error);
			})

		// $scope.user=null;
		Swal.fire({

			title: 'Registration Successful!',
			text: 'Thank you for registering!',
			icon: 'success',
			confirmButtonText: 'OK',
			allowOutsideClick: false

		}).then((result) => {

			console.log("gh")
			// Reload the page after the success message is closed by clicking "OK"
			document.getElementById('login').click();

		});
		//sleepForFiveSeconds();



	}



}]);

//service for update ,save and review
app.service('personService', function($http) {

	this.savePerson = function(user) {


		return $http.post('/api/persons', user);
	};

	this.getPersonById = function(id) {

		return $http.get('/api/persons/' + id);
	};

	this.updatePerson = function(id, updatedPerson) {

		return $http.put('/api/persons/' + id, updatedPerson);
	};
});

// directives for pdf and img

//for img
app.directive('fileInput', ['$rootScope', function($rootScope) {
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function(scope, element, attrs, ngModelCtrl) {
			element.bind('change', function() {
				scope.$apply(function() {
					var validExtensions = ['jpg', 'jpeg', 'png', 'gif']; // Add the file extensions you want to allow
					var maxSizeMB = 1; // Set the maximum file size in megabytes

					var isValid = false;
					var file = element[0].files[0];


					if (file) {
						var fileExtension = file.name.split('.').pop().toLowerCase();
						var fileSizeMB = file.size / (1024 * 1024);

						if (validExtensions.indexOf(fileExtension) !== -1 && fileSizeMB <= maxSizeMB) {
							isValid = true;
							scope.ig = true;
							$rootScope.ig = true; // Set ig to true when a valid file is selected
							scope.o = true;
						}
					}

					// Clear the file input value if the file is not valid
					if (!isValid) {
						element.val(null);
						scope.imagefile = null;
					}

					// Update the model with the validity status
					ngModelCtrl.$setValidity('file', isValid);

					// Display error message
					if (isValid) {
						scope.imageErrorMessage = '';
						element.val(null);
					} else {
						if (fileSizeMB > maxSizeMB) {
							scope.ig = false; // Set ig to true when a valid file is selected
							scope.o = false;
							$rootScope.ig = false;
							scope.imageErrorMessage = 'File size exceeds the maximum allowed (' + maxSizeMB + 'MB).';
						} else {
							scope.ig = false; // Set ig to true when a valid file is selected
							scope.o = false;
							$rootScope.ig = false;
							scope.imageErrorMessage = 'Invalid file type. Please choose a valid file.';
						}
					}
				});
			});
		}
	};
}]);


// for pan
app.directive('fileInputa', ['$rootScope', function($rootScope) {
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function(scope, element, attrs, ngModelCtrl) {
			element.bind('change', function() {
				scope.$apply(function() {
					var validExtensions = ['pdf']; // Add the file extensions you want to allow
					var maxSizeMB = 2; // Set the maximum file size in megabytes

					var isValid = false;
					var file = element[0].files[0];

					if (file) {
						var fileExtension = file.name.split('.').pop().toLowerCase();
						var fileSizeMB = file.size / (1024 * 1024);

						if (validExtensions.indexOf(fileExtension) !== -1 && fileSizeMB <= maxSizeMB) {
							isValid = true;
							scope.pp = true;
							$rootScope.pp = true; // Set pp to true when a valid file is selected
						}
					}

					// Clear the file input value if the file is not valid
					if (!isValid) {
						element.val(null);
						scope.panfile = null;
					}

					// Update the model with the validity status
					ngModelCtrl.$setValidity('file', isValid);

					// Display error message
					if (isValid) {
						scope.panErrorMessage = '';
						element.val(null);
					} else {
						if (fileSizeMB > maxSizeMB) {
							scope.pp = false;
							$rootScope.pp = false;
							scope.panErrorMessage = 'File size exceeds the maximum allowed (' + maxSizeMB + 'MB).';
						} else {
							scope.pp = false;
							$rootScope.pp = false;
							scope.panErrorMessage = 'Invalid file type. Please choose a valid file.';
						}
					}
				});
			});
		}
	};
}]);

// for adhar
app.directive('fileInputb', ['$rootScope', function($rootScope) {
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function(scope, element, attrs, ngModelCtrl) {
			element.bind('change', function() {
				scope.$apply(function() {
					var validExtensions = ['pdf']; // Add the file extensions you want to allow
					var maxSizeMB = 2; // Set the maximum file size in megabytes

					var isValid = false;
					var file = element[0].files[0];

					if (file) {
						var fileExtension = file.name.split('.').pop().toLowerCase();
						var fileSizeMB = file.size / (1024 * 1024);

						if (validExtensions.indexOf(fileExtension) !== -1 && fileSizeMB <= maxSizeMB) {
							isValid = true;
							scope.aa = true;
							$rootScope.aa = true; // Set aa to true when a valid file is selected
						}
					}

					// Clear the file input value if the file is not valid
					if (!isValid) {
						element.val(null);
						scope.adharfile = null;
					}

					// Update the model with the validity status
					ngModelCtrl.$setValidity('file', isValid);

					// Display error message
					if (isValid) {
						scope.adharErrorMessage = '';
						element.val(null);
					} else {
						if (fileSizeMB > maxSizeMB) {
							scope.aa = false;
							$rootScope.aa = false;
							scope.adharErrorMessage = 'File size exceeds the maximum allowed (' + maxSizeMB + 'MB).';
						} else {
							scope.aa = false;
							$rootScope.aa = false;
							scope.adharErrorMessage = 'Invalid file type. Please choose a valid file.';
						}
					}
				});
			});
		}
	};
}]);

// for ten
app.directive('fileInputc', ['$rootScope', function($rootScope) {
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function(scope, element, attrs, ngModelCtrl) {
			element.bind('change', function() {
				scope.$apply(function() {
					var validExtensions = ['pdf']; // Add the file extensions you want to allow
					var maxSizeMB = 2; // Set the maximum file size in megabytes

					var isValid = false;
					var file = element[0].files[0];

					if (file) {
						var fileExtension = file.name.split('.').pop().toLowerCase();
						var fileSizeMB = file.size / (1024 * 1024);

						if (validExtensions.indexOf(fileExtension) !== -1 && fileSizeMB <= maxSizeMB) {
							isValid = true;
							$rootScope.ttt = true;
							scope.tt = true; // Set tt to true when a valid file is selected
						}
					}

					// Clear the file input value if the file is not valid
					if (!isValid) {
						element.val(null);
						scope.tenfile = null;
					}

					// Update the model with the validity status
					ngModelCtrl.$setValidity('file', isValid);

					// Display error message
					if (isValid) {
						scope.tenErrorMessage = '';
						element.val(null);
					} else {
						if (fileSizeMB > maxSizeMB) {
							scope.tt = false;
							$rootScope.ttt = false;
							scope.tenErrorMessage = 'File size exceeds the maximum allowed (' + maxSizeMB + 'MB).';
						} else {
							scope.tt = false;
							$rootScope.ttt = false;
							scope.tenErrorMessage = 'Invalid file type. Please choose a valid file.';
						}
					}
				});
			});
		}
	};
}]);

//for twe
app.directive('fileInputd', ['$rootScope', function($rootScope) {
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function(scope, element, attrs, ngModelCtrl) {
			element.bind('change', function() {
				scope.$apply(function() {
					var validExtensions = ['pdf']; // Add the file extensions you want to allow
					var maxSizeMB = 2; // Set the maximum file size in megabytes

					var isValid = false;
					var file = element[0].files[0];

					if (file) {
						var fileExtension = file.name.split('.').pop().toLowerCase();
						var fileSizeMB = file.size / (1024 * 1024);

						if (validExtensions.indexOf(fileExtension) !== -1 && fileSizeMB <= maxSizeMB) {
							isValid = true;
							scope.ww = true;
							$rootScope.ww = true; // Set ww to true when a valid file is selected
						}
					}

					// Clear the file input value if the file is not valid
					if (!isValid) {
						element.val(null);
						scope.twelvefile = null;
					}

					// Update the model with the validity status
					ngModelCtrl.$setValidity('file', isValid);

					// Display error message
					if (isValid) {
						scope.twelveErrorMessage = '';
						element.val(null);
					} else {
						if (fileSizeMB > maxSizeMB) {
							scope.ww = false;
							$rootScope.ww = false;
							scope.twelveErrorMessage = 'File size exceeds the maximum allowed (' + maxSizeMB + 'MB).';
						} else {
							scope.ww = false;
							$rootScope.ww = false;
							scope.twelveErrorMessage = 'Invalid file type. Please choose a valid file.';
						}
					}

					// If you want to apply styles based on the validation status, you can use the following code:
					// element.toggleClass('invalid-file', !isValid);
				});
			});
		}
	};
}]);


// controller
app.controller('YourController', function($scope, $sce, $http, $rootScope) {
	$scope.select = function() {
		document.getElementById('openModalBtn').click();
	}
	$scope.super = function() {
		document.getElementById('btnn').click();
		$scope.submit();
	}
	$scope.fileSelected = function() {
		var inputElement = document.querySelector('input[type="file"]');
		var file = inputElement.files[0];

		// Log the file details (you can perform further actions here)
		console.log('Selected File:', file);

		// Set the selected file name for display
		$scope.selectedFileName = file.name;


		// If the file is a PDF, create a trusted URL for the iframe source
		if (file.type === 'application/pdf') {
			var reader = new FileReader();

			reader.onload = function(e) {
				// Create a trusted URL for the PDF content
				$scope.pdfSrc = $sce.trustAsResourceUrl(URL.createObjectURL(new Blob([e.target.result], { type: 'application/pdf' })));

				// Apply changes to update the view
				$scope.$apply();
			};

			// Read the file as an ArrayBuffer
			reader.readAsArrayBuffer(file);
		} else {
			// Handle non-PDF files if needed
			console.log('Selected file is not a PDF.');
		}
	};
	$scope.selectpic = function() {
		// Trigger click event on the file input
		document.getElementById('pic').click();
	};
	$scope.selectpan = function() {
		$scope.newpan=null;
		$scope.selectedFileNamepan = null;
		
		$scope.selectedFileName = null;
		$scope.pdfSrc = null;
		// Trigger click event on the file input
		document.getElementById('pan').click();

	};
	$scope.selectadhar = function() {
		$scope.newpan=null;
		$scope.newadhar=null;
		$scope.selectedFileNameadhar = null;
		$scope.selectedFileName = null;
		$scope.pdfSrc = null;
		// Trigger click event on the file input
		document.getElementById('adhar').click();
	};
	$scope.selectten = function() {
		$scope.newpan=null;
		$scope.newadhar=null;
		$scope.newten=null;
		$scope.selectedFileNameten = null;
		$scope.selectedFileName = null;
		$scope.pdfSrc = null;
		// Trigger click event on the file input
		document.getElementById('ten').click();
	};
	$scope.selecttwelve = function() {
		$scope.newpan=null;
		$scope.newadhar=null;
		$scope.newten=null;
		$scope.newtwe=null;
		$scope.selectedFileNametwelve = null;
		$scope.selectedFileName = null;
		$scope.pdfSrc = null;
		// Trigger click event on the file input
		document.getElementById('twelve').click();
	};
	$scope.img = false; $scope.p = false; $scope.a = false; $scope.t = false; $scope.tw = false;

	$scope.imagefile = null;

	$scope.imagefileSelected = function(element) {
		$scope.$apply(function() {
			$scope.imagefile = element.files[0];
		});
		if (element.files && element.files[0]) {
			var reader = new FileReader();
			reader.onload = function(e) {
				$scope.$apply(function() {
					$scope.imagePreview = e.target.result;
					$scope.img = true;

					//$scope.o = true;


				});
			};
			reader.readAsDataURL(element.files[0]);
		}
		$scope.submit();
	};
	$scope.panfile = null;

	$scope.panfileSelected = function(element) {
		// Log the file details
		console.log('Selected File:', element.files[0]);

		// Set the selected file name for display
		$scope.selectedFileName = element.files[0].name;
		$scope.selectedFileNamepan = element.files[0].name;
		$scope.newpan = $scope.selectedFileNamepan;

		// If the file is a PDF, create a trusted URL for the iframe source
		if (element.files[0].type === 'application/pdf') {
			var reader = new FileReader();

			reader.onload = function(e) {
				$scope.select();
				// Create a trusted URL for the PDF content
				$scope.pdfSrc = $sce.trustAsResourceUrl(URL.createObjectURL(new Blob([e.target.result], { type: 'application/pdf' })));
				$scope.$apply();

			};

			// Read the file as an ArrayBuffer
			reader.readAsArrayBuffer(element.files[0]);
		} else {
			// Handle non-PDF files if needed
			console.log('Selected file is not a PDF.');
		}

		$scope.$apply(function() {
			$scope.panfile = element.files[0];
			$scope.p = true;
		});
	};

	$scope.adharfile = null;

	$scope.adharfileSelected = function(element) {
		// Log the file details
		console.log('Selected File:', element.files[0]);

		// Set the selected file name for display
		$scope.selectedFileName = element.files[0].name;
		$scope.selectedFileNameadhar = element.files[0].name;
		$scope.newadhar = $scope.selectedFileNameadhar;

		// If the file is a PDF, create a trusted URL for the iframe source
		if (element.files[0].type === 'application/pdf') {
			var reader = new FileReader();

			reader.onload = function(e) {
				$scope.select();
				// Create a trusted URL for the PDF content
				$scope.pdfSrc = $sce.trustAsResourceUrl(URL.createObjectURL(new Blob([e.target.result], { type: 'application/pdf' })));

				// Apply changes to update the view
				$scope.$apply();
			};

			// Read the file as an ArrayBuffer
			reader.readAsArrayBuffer(element.files[0]);
		} else {
			// Handle non-PDF files if needed
			console.log('Selected file is not a PDF.');
		}

		$scope.$apply(function() {
			$scope.adharfile = element.files[0];
			$scope.a = true;
		});
	};


	$scope.tenfile = null;
	$scope.tenfileSelected = function(element) {
		// Log the file details
		console.log('Selected File:', element.files[0]);

		// Set the selected file name for display
		$scope.selectedFileName = element.files[0].name;
		$scope.selectedFileNameten = element.files[0].name;
		$scope.newten = $scope.selectedFileNameten;
		// If the file is a PDF, create a trusted URL for the iframe source
		if (element.files[0].type === 'application/pdf') {
			var reader = new FileReader();

			reader.onload = function(e) {
				$scope.select();
				// Create a trusted URL for the PDF content
				$scope.pdfSrc = $sce.trustAsResourceUrl(URL.createObjectURL(new Blob([e.target.result], { type: 'application/pdf' })));

				// Apply changes to update the view
				$scope.$apply();
			};

			// Read the file as an ArrayBuffer
			reader.readAsArrayBuffer(element.files[0]);
		} else {
			// Handle non-PDF files if needed
			console.log('Selected file is not a PDF.');
		}

		$scope.$apply(function() {
			$scope.tenfile = element.files[0];
			$scope.t = true;
		});
	};

	$scope.twelvefile = null;

	$scope.twelvefileSelected = function(element) {
		// Log the file details
		console.log('Selected File:', element.files[0]);

		// Set the selected file name for display
		$scope.selectedFileName = element.files[0].name;
		$scope.selectedFileNametwelve = element.files[0].name;
		$scope.newtwe = $scope.selectedFileNametwelve;
		// If the file is a PDF, create a trusted URL for the iframe source
		if (element.files[0].type === 'application/pdf') {
			var reader = new FileReader();

			reader.onload = function(e) {
				$scope.select();
				// Create a trusted URL for the PDF content
				$scope.pdfSrc = $sce.trustAsResourceUrl(URL.createObjectURL(new Blob([e.target.result], { type: 'application/pdf' })));

				// Apply changes to update the view
				$scope.$apply();
			};

			// Read the file as an ArrayBuffer
			reader.readAsArrayBuffer(element.files[0]);
		} else {
			// Handle non-PDF files if needed
			console.log('Selected file is not a PDF.');
		}

		$scope.$apply(function() {
			$scope.twelvefile = element.files[0];
			$scope.tw = true;
		});
	};


	$scope.submit = function() {
		// Add logic to submit the file
		console.log('File submitted:', $scope.selectedFileName);
		// Replace this with your actual submission logic

		if ($scope.imagefile && $scope.panfile && $scope.adharfile && $scope.tenfile && $scope.twelvefile) {

			$scope.files();
		}

		$scope.selectedFileName = null;
		$scope.pdfSrc = null;
	};
	$scope.files = function() {
		if ($scope.imagefile && $scope.panfile && $scope.adharfile && $scope.tenfile && $scope.twelvefile) {
			var formData = new FormData();
			formData.append('file', $scope.imagefile);
			formData.append('pan', $scope.panfile);
			formData.append('adhar', $scope.adharfile);
			formData.append('ten', $scope.tenfile);
			formData.append('twelve', $scope.twelvefile);




			$http.post('/upload', formData, {
				transformRequest: angular.identity,
				headers: {
					'Content-Type': undefined
				}
			}).then(function(response) {
				alert(response.data);
			}, function(error) {
				console.error('Error uploading file', error);
			});
		}


		else {
			alert('File Not selected');
		}

	}

	$scope.fileedit = function() {
		document.getElementById('btnn').click();
		if ($scope.selectedFileName === $scope.newpan) {

			$scope.pana();
		

		} else if ($scope.selectedFileName === $scope.newadhar) {

			$scope.adhara();
		}
		else if ($scope.selectedFileName === $scope.newten) {

			$scope.tena();
		}
		else if ($scope.selectedFileName === $scope.newtwe) {

			$scope.twelvea();

		}

	}
	$scope.pana = function() {
		$scope.pp = false;
		$scope.selectedFileNamepan = null;
		$scope.selectedFileName = null;
		$scope.pdfSrc = null;
		$rootScope.pp = false;

	}
	$scope.adhara = function() {
		$scope.aa = false;
		$scope.selectedFileNameadhar = null;
		$scope.selectedFileName = null;
		$scope.pdfSrc = null;
		$rootScope.aa = false;
	}

	$scope.tena = function() {
		$scope.tt = false;
		$scope.selectedFileNameten = null;
		$scope.selectedFileName = null;
		$scope.pdfSrc = null;
		$rootScope.tt = false;

	}

	$scope.twelvea = function() {
		$scope.ww = false;
		$scope.selectedFileNametwelve = null;
		$scope.selectedFileName = null;
		$scope.pdfSrc = null;
		$rootScope.ww = false;
	}



});
