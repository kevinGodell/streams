'use strict';

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;

const { spawn } = require('child_process');

const fps = 24;//number of frames per second(same as input video) might not be necessary

const gop = 24;//should create segments that are 1 second in duration

//setting crf to 0 is not compatible with setting profile

const crf = 25;

const profile = 'main';

const level = 31;

const scale =  .75;//used as width of video, height will automatically scale

const width = 1024 * scale;

const height = 576 * scale;

const segment_type = 'fmp4';//fmp4 mpegts

const playlist_type = 'vod';//vod event 0(live)

const path = `${__dirname}/hls_${segment_type}_${playlist_type}/hls.m3u8`;

const params = [
    /* log info to console */
    '-loglevel', 'quiet',
    '-stats',

    //overwrite output file if found
    '-y',

    /* use hardware acceleration if available */
    '-hwaccel', 'auto',
    
    /* use the orignial input source */
    //'-re',
    '-i', `${__dirname}/src/BigBuckBunny63MB.mp4`,

    /* set output flags */
    //'-an',
    '-c:a', 'aac',
    '-c:v', 'libx264',
    //'-movflags', '+faststart+frag_keyframe+empty_moov+default_base_moof+omit_tfhd_offset',
    //'-f', 'mp4',
    '-f', 'hls',
    //'-hls_segment_type', 'mpegts'
    '-hls_segment_type', segment_type,
    '-hls_time', '1',
    //'-hls_playlist_type', '0',
    '-hls_playlist_type', playlist_type,
    //'-hls_segment_filename', 'fmp4',
    //'-hls_segment_filename', `big_buck_bunny-${fps}fps-${gop}gop-${width}x${height}-${profile}-${level}__`,
    //'',
    '-vf', `fps=${fps},scale=${width}:${height},format=yuv420p`,
    '-g', gop,
    '-profile:v', profile,
    '-level:v', level,
    '-crf', crf,
    '-metadata', `title=big buck bunny ${fps}fps ${gop}gop ${width}x${height} ${profile} ${level}`,
    //'-reset_timestamps', '1',
    '-frag_duration', '1000000',//make ffmpeg create segments that are 30 seconds duration
    '-min_frag_duration', '1000000',//make ffmpeg create segments that are 30 seconds duration
    //`hls-fmp4/big_buck_bunny-${fps}fps-${gop}gop-${width}x${height}-${profile}-${level}.m3u8`
    path
];

const ffmpeg = spawn(ffmpegPath, params, {stdio: ['ignore', 'pipe', 'inherit']});

ffmpeg.on('error', (error) => {
    console.log('ffmpeg error', error);
});

ffmpeg.on('exit', (code, signal) => {
    console.log(`FFMPEG exited with code ${code} and signal ${signal}`);
});