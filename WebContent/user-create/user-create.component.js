'use strict';

// Register `userCreate` component, along with its associated controller and template
angular.
module('userCreate').
component('userCreate', {
	templateUrl: 'user-create/user-create.template.html',
	controller: ['$rootScope', '$scope', '$http', '$window', 'commonService', 
	             'userCreateSevice', '$uibModal', "$q",
		function UserCreateController($rootScope, $scope, $http, $window,
				commonService, userCreateSevice, $uibModal, $q) {
		
			var ynChkDup = false;
			
			$scope.login = function(){
				$window.location.href = "#!/login";
			};
			$scope.isDisabled = false;
			$scope.createUser = function() {
				var self = this;
				if (checkUserFields() == false) {
					return;
				}
				
				if (!self.ynChkDup) {
					$window.alert("중복체크를 하지 않았습니다.");
		            document.getElementById("dupCheck").focus();
					return;
				}
				
				$scope.isDisabled = true;
				var insertUser = getCreateUserBody();
				
				userCreateSevice.doChkMe(insertUser.DC_EMIADDR).then(function (res) {
					if(res.status === 200) {
						insertUser.NO_OWNCONF = res.data.NO_OWNCONF; // 본인확인 여부 데이터
						userCreateSevice.createUser(insertUser).then(
							function successCallback(response) {
								ga('send','event','로그인 페이지','click','가입하기 성공');
								$window.alert($scope.userId + "님이 가입되었습니다.");
								$window.location.href = "#!/login";
							}, function errorCallback(response) {
								ga('send','event','로그인 페이지','click','가입하기 실패');
							}
								
//								function (res) {
//							//ga('send','event','로그인 페이지','click','가입하기 성공');
//							if(res.status === 200) {
//								//ga('send','event','로그인 페이지','click','가입하기 성공');
//								$window.alert($scope.userId + "님이 가입되었습니다.");
//								$window.location.href = "#!/login";
//							}
//							else {
//								//ga('send','event','로그인 페이지','click','가입하기 실패');
//							}
//						}
								
						);
					}
				});

				function getCreateUserBody() {
					var body = {
						"NM_C"       : $scope.companyName,
						"DC_EMIADDR" : $scope.email,
						"DC_ID"      : $scope.userId,
						"DC_PWD"     : $scope.pwd,
						"CD_BSNSCLFT": "999",
						"NO_BSNSRGTT": "",
						"YN_COMMSALEREG": "N",
						"NO_COMMSALEREG": "",
						"NO_OWNCONF"    : ""
					};

					return body;
				};
			};
			
			$scope.changeCompanyName = function() {
				var self = this;
				
				self.ynChkDup = false;
			};

			$scope.dateFormat = function (val) {
				var yhPattern = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,
				    yPattern = /(\d{4})(\d{2})(\d{2})/,
				    ret = '';
				
				if(val.length === 14) {
					ret = val.replace(yhPattern, '$1-$2-$3 $4:$5');
				}
				else if(val.length === 8) {
					val.replace(yhPattern, '$1-$2-$3');
				}
				
				return ret;
			};
			
			$scope.dupCheck = function() {
				var self = this,
				param = {};
			
				if(self.companyName === '') {
					$window.alert('사업자명을 입력하여 주세요.');
					$timeout(function () {
						document.getElementById("companyName").focus();
	                }, 500);
					return;
				}
				else if(self.email === '') {
					$window.alert('이메일을 입력하여 주세요.');
					$timeout(function () {
						document.getElementById("email").focus();
	                }, 500);
					return;
				}
				
				userCreateSevice.dupCheckNmC(self.companyName, self.email).then(function (res) {
					self.ynChkDup = false; // 사업자명 변경시 'N'으로 변경해야 함.
	
					if(res.status !== 200) return;
					
					if(res.data === 'null' || (res.data[0].CD_JOINYN === '' && res.data[1].CD_JOINYN === '')) {
						self.ynChkDup = true; // 사업자명 변경시 'N'으로 변경해야 함.
						$window.alert('중복된 사업자명과 이메일이 없습니다.');
					}
					else if(res.data[0].CD_JOINYN == '001') {
						$window.alert('사업자명['+self.companyName+']은 '+self.dateFormat(res.data[0].DTS_JOINREQ) + '에 가입요청 중 입니다.');
					}
					else if(res.data[0].CD_JOINYN == '002') {
						$window.alert('사업자명['+self.companyName+']은 미가입상태입니다. 관리자에게 문의바랍니다.');
					}
					else if(res.data[0].CD_JOINYN == '003') {
						$window.alert('사업자명['+self.companyName+']은 '+self.dateFormat(res.data[0].DTS_JOIN) + '에 가입 중 입니다.');
					}
					else if(res.data[1].CD_JOINYN == '001') {
						$window.alert('이메일['+self.email+']은 '+self.dateFormat(res.data[1].DTS_JOINREQ) + '에 가입요청 중 입니다.');
					}
					else if(res.data[1].CD_JOINYN == '002') {
						$window.alert('이메일['+self.email+']은 '+'미가입상태입니다. 관리자에게 문의바랍니다.');
					}
					else if(res.data[1].CD_JOINYN == '003') {
						$window.alert('이메일['+self.email+']은 '+self.dateFormat(res.data[1].DTS_JOIN) + '에 가입 중 입니다.');
					}
					else {
						$window.alert('관리자에게 문의바랍니다.');
					}
				});
			};
			
			// Seller를 생성하기 전에 유효성 검증
			var checkUserFields = function() {
                // 사업자명
                if ($scope.companyName == undefined || $scope.companyName === "") {
                	$window.alert("[필수] 사업자명을 입력해주세요.");
					document.getElementById("companyName").focus();
					return false;
                } 
                else if (!/^[가-힣a-zA-Z0-9~*()[\]\-<> ][가-힣a-zA-Z0-9~*()[\]\-<> ]{1,50}$/.test($scope.companyName)) {
                	$window.alert("[형식] 사업자명은 유효하지 않은 형식입니다. 영문, 한글, 공백만 사용 가능합니다.");
					document.getElementById("companyName").focus();
					return false;
                }
                
                // ID
                else if ($scope.userId == undefined || $scope.userId === "") {
                	$window.alert("[필수] ID를 입력해주세요.");
					document.getElementById("userId").focus();
                    return false;
                } 
                else if (!/^[a-zA-Z0-9]{3,15}$/.test($scope.userId)) {
                	$window.alert("[형식] ID는 유효하지 않은 형식입니다. 영문(대소문자 구분 안함), 숫자만 가능합니다.");
					document.getElementById("userId").focus();
                    return false;
                }

                // PASSWORD
                else if ($scope.pwd == undefined || $scope.pwd === "") {
                	$window.alert("[필수] 패스워드를 입력해주세요.");
					document.getElementById("pwd").focus();
                    return false;
				} 
                else if (!/^[a-zA-Z0-9~`|!@#$%^&*()[\]\-=+_|{};':\\\"<>?,./]{8,15}$/.test($scope.pwd)) {
                	$window.alert("[형식] 패스워드는 유효하지 않은 형식입니다. 8~15자리 이하입니다.");
					document.getElementById("pwd").focus();
                    return false;
				} 
                else if ($scope.pwd !== $scope.confirmPwd) {
                	$window.alert("[MATCH] 비밀번호가 일치하지 않습니다.");
					document.getElementById("confirmPassword").focus();
                    return false;
				}

                // EMAIL
                else if (!/^[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[@]{1}[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[.]{1}[A-Za-z]{2,5}$/.test($scope.email)) {
                	$window.alert("[형식] 이메일은 유효하지 않은 형식입니다.");
					document.getElementById("email").focus();
                    return false;
                }
                
                else if($scope.YN_TERM === 'N'){
                	$window.alert("약관에 동의 해셔야 가입이 가능합니다.");
                	return false;
                }
                
				return true;
			};
			
			/**
			 * 약관팝업창
			 */
			$scope.popCla = function () {
				var self = this,
				modalInstance = $uibModal.open({
					component  : "userTerms",
	                size        : "sm",
	                resolve: {
	                	resData: 
							function ($q) {
								var defer   = $q.defer(),
									resData = {};

								userCreateSevice.selectCla('001').then(function (res) {
									if(res.status === 200) {
										resData.DC_CLA001 = res.data;
										userCreateSevice.selectCla('002').then(function (res) {
											if(res.status === 200) {
												resData.DC_CLA002 = res.data;
												userCreateSevice.selectCla('003').then(function (res) {
													if(res.status === 200) {
														resData.DC_CLA003 = res.data;
														defer.resolve(resData);
													}
												});
											}
										});
									}
								});							
								return defer.promise;
							}
	                }
				});
				
				modalInstance.result.then(function ( result ) {
	            });
			};
		}
	]
});