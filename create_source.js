'use strict';

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;

const { spawn } = require('child_process');

const fps = 24;//number of frames per second(same as input video) might not be necessary

const gop = 24;//should create segments that are 1 second in duration

//setting crf to 0 is not compatible with setting profile

const crf = 25;

const profile = 'main';

const level = 31;

const scale =  1;//used as width of video, height will automatically scale

const width = 1024 * scale;

const height = 576 * scale;

const params = [
    /* log info to console */
    '-loglevel', 'quiet',
    '-stats',

    //overwrite output file if found
    '-y',

    /* use hardware acceleration if available */
    '-hwaccel', 'auto',
    
    /* use an artificial video input */
    '-re',
    '-i', `${__dirname}/src/BigBuckBunny63MB.mp4`,

    /* set output flags */
    //'-an',
    '-c:a', 'aac',
    '-c:v', 'libx264',
    '-movflags', '+faststart+frag_keyframe+empty_moov+default_base_moof+omit_tfhd_offset',
    '-f', 'mp4',
    '-vf', `fps=${fps},scale=${width}:${height},format=yuv420p`,
    '-g', gop,
    '-profile:v', profile,
    '-level:v', level,
    '-crf', crf,
    '-metadata', `title=big buck bunny ${fps}fps ${gop}gop ${width}x${height} ${profile} ${level}`,
    //'-reset_timestamps', '1',
    //'-frag_duration', '1000000',//make ffmpeg create segments that are 30 seconds duration
    //'-min_frag_duration', '1000000',//make ffmpeg create segments that are 30 seconds duration
    `big_buck_bunny-${fps}fps-${gop}gop-${width}x${height}-${profile}-${level}.mp4`
];

const ffmpeg = spawn(ffmpegPath, params, {stdio: ['ignore', 'pipe', 'inherit']});

ffmpeg.on('error', (error) => {
    console.log('ffmpeg error', error);
});

ffmpeg.on('exit', (code, signal) => {
    console.log(`FFMPEG exited with code ${code} and signal ${signal}`);
});