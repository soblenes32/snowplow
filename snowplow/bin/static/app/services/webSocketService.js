angular.module("SnowplowApp")
.service("webSocketService", function($rootScope, telemetryDataModelService, vehicleCommandDataModelService, zoneCellDataModelService){
	var self = this;

	/*********************************************************************************
	 * Subscribe listeners
	 *********************************************************************************/
	this.connectListeners = function(){
		var socket = new SockJS('/gs-guide-websocket');
		stompClient = Stomp.over(socket);
		stompClient.debug = null;
		stompClient.connect({}, function (frame) {
			stompClient.subscribe('/toclient/telemetry/vehicle', function (payload) {
				$rootScope.$apply(function(){
					telemetryDataModelService.updateVehicleState(angular.fromJson(payload.body));
		        });
			});
			stompClient.subscribe('/toclient/telemetry/anchors', function (payload) {
				$rootScope.$apply(function(){
					telemetryDataModelService.anchorArr = angular.fromJson(payload.body);
		        });
			});
			stompClient.subscribe('/toclient/telemetry/lidar', function (payload) {
				$rootScope.$apply(function(){
					telemetryDataModelService.updateLidarDetections(angular.fromJson(payload.body));
		        });
			});
			stompClient.subscribe('/toclient/vehiclecommand/commands', function (payload) {
				$rootScope.$apply(function(){
					vehicleCommandDataModelService.commandArr = angular.fromJson(payload.body);
		        });
			});
			stompClient.subscribe('/toclient/zones/update', function (payload) {
				$rootScope.$apply(function(){
					zoneCellDataModelService.updateZoneCells(angular.fromJson(payload.body));
		        });
			});
			stompClient.subscribe('/toclient/zones/delta', function (payload) {
				$rootScope.$apply(function(){
					zoneCellDataModelService.updateZoneCellDelta(angular.fromJson(payload.body));
		        });
			});
		});
	}
	
	this.connectListeners();
	
	
	/*********************************************
	 ************** Send methods *****************
	 *********************************************/
	
	
	/*********************************************************************************
	 * Joystick methods
	 *********************************************************************************/
	this.sendJoystickData = function(d){
		stompClient.send("/toserver/joystick", {}, JSON.stringify(d));
	}
	
	
	/*********************************************************************************
	 * Vehicle Command methods
	 *********************************************************************************/
	this.issueVehicleCommand = function(vehicleCommand){
		stompClient.send("/toserver/vehiclecommand/issue", {}, JSON.stringify(vehicleCommand));
	}
	
	this.rescendVehicleCommand = function(vehicleCommand){
		console.dir(vehicleCommand);
		stompClient.send("/toserver/vehiclecommand/rescend", {}, JSON.stringify(vehicleCommand));
	}
	
	this.purgeVehicleCommands = function(){
		stompClient.send("/toserver/vehiclecommand/purge", {}, "");
	}
	
	this.setOperationMode = function(mode){
		stompClient.send("/toserver/vehiclecommand/mode", {}, JSON.stringify({vehicleOperationMode:mode}));
	}
	
	/*********************************************************************************
	 * Zonecell update methods
	 *********************************************************************************/
	this.sendZoneCellData = function(d){
		stompClient.send("/toserver/zones/issue", {}, JSON.stringify(d));
	}
}); 