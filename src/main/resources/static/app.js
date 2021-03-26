var app = (function () {

    class Point{
        constructor(x,y){
            this.x=x;
            this.y=y;
        }        
    }
    
    var stompClient = null;

    var addPointToCanvas = function (evt) {
        var point=getMousePosition(evt);
        stompClient.send("/topic/newpoint", {}, JSON.stringify(point));
    };
    
    
    var getMousePosition = function (evt) {
        canvas = document.getElementById("canvas");
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    };


    var connectAndSubscribe = function () {
        console.info('Connecting to WS...');
        var socket = new SockJS('/stompendpoint');
        stompClient = Stomp.over(socket);
        
        //subscribe to /topic/TOPICXX when connections succeed
        stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);
            stompClient.subscribe('/topic/newpoint', function (eventbody) {
             var point =JSON.parse(eventbody.body);
             var canvas = document.getElementById("canvas");
             var ctx = canvas.getContext("2d");
             ctx.beginPath();
             ctx.arc(point.x, point.y, 1, 0, 2 * Math.PI);
             ctx.stroke();
            });
        });

    };
    
    

    return {

        init: function () {

            
            //websocket connection
            connectAndSubscribe();
             var canvas = document.getElementById("canvas"),
             context = canvas.getContext("2d");
             if (window.PointerEvent) {
                canvas.addEventListener("pointerdown", addPointToCanvas, false);
             }
             else{
                //Provide fallback for user agents that do not support Pointer Events
                canvas.addEventListener("mousedown", addPointToCanvas, false);
             }
        },

        publishPoint: function(px,py){
            var pt=new Point(px,py);
            console.info("publishing point at "+pt);
            addPointToCanvas(pt);

            //publicar el evento
        },

        disconnect: function () {
            if (stompClient !== null) {
                stompClient.disconnect();
            }
            setConnected(false);
            console.log("Disconnected");
        }
    };

})();