status = '';
object_needed = '';
objects = [];
check = '';

function setup(){
    canvas = createCanvas(500, 400);
    canvas.position(710,450);

    video = createCapture(VIDEO);
    video.size(500, 400);
    video.hide();
}

function start(){
    object_needed = document.getElementById('input_name').value;
    if(object_needed != ''){
        object_detector = ml5.objectDetector('cocossd', model_loaded);
        document.getElementById('status').innerHTML = 'Detecting Objects...';
    }else{
        window.alert('Please Fill The Input!');
    }
    
    
}

function model_loaded(){
    console.log('Model Loaded!');
    status = true;
    object_detector.detect(video, got_results)
}

function draw(){
    image(video, 0, 0, 500, 400);

    if(status != ''){
        for(i = 0;i < objects.length; i++){
            fill('blue');
            percent = floor(objects[i].confidence * 100);
            text(`${objects[i].label} ${percent}%`, objects[i].x, objects[i].y + 15);

            noFill();
            stroke('blue');
            rect(objects[i].x, objects[i].y, objects[i].width, objects[i].height, 10, 10, 10, 10)

            if(objects[i].label == object_needed){
                check = 'yes';
            }
        }
        if(check == 'yes'){
                video.stop();
                object_detector.detect(got_results);
                document.getElementById('object_status').innerHTML = `${object_needed} Found!`;

                synth = window.speechSynthesis;
                utter_this = new SpeechSynthesisUtterance(`${object_needed} Found!`);
                synth.speak(utter_this);
            }else{
                document.getElementById('object_status').innerHTML = `${object_needed} Not Found!`;

                synth = window.speechSynthesis;
                utter_this = new SpeechSynthesisUtterance(`${object_needed} Not Found!`);
                synth.speak(utter_this);
            }
    }
}

function got_results(error, results){
    if(error){
        console.error(error)
    }else{
        console.log(results);
        objects = results;
    }
}