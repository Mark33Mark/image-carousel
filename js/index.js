
let xPos = 0;

gsap.timeline()
    
    //set initial rotationY so the parallax jump happens off screen
    .set('.ring', { rotationY:180, cursor:'grab' }) 
    
    // apply transform rotations to each image
    .set('.img',  { 
        rotateY: (i)=> i*-36,
        transformOrigin: '50% 50% 1000px',
        z: -1000,
        // backgroundPosition:(i)=>getBgPos(i),
        backfaceVisibility:'hidden'
        })    
        .from('.img', {
        duration:1.5,
        y:200,
        opacity:0,
        stagger:0.1,
        ease:'expo'
        })

        .add(()=>{
        $('.img').on('mouseenter', (e)=>{
            let current = e.currentTarget;
            gsap.to('.img', {opacity:(i,t)=>(t==current)? 1:0.5, ease:'power3'});
        });

        $('.img').on('mouseleave', (e)=>{
            gsap.to('.img', {opacity:1, ease:'power2.inOut'});
        });
        
    }, '-=0.5');

$(window).on('mousedown touchstart', dragStart);
$(window).on('mouseup touchend', dragEnd);


function dragStart(e){ 
    if (e.touches) e.clientX = e.touches[0].clientX;
    xPos = Math.round(e.clientX);
    gsap.set('.ring', {cursor:'grabbing'});
    $(window).on('mousemove touchmove', drag);
}


function drag(e){
    if (e.touches) e.clientX = e.touches[0].clientX;    

    gsap.to('.ring', {
        rotationY: '-=' +( (Math.round(e.clientX)-xPos)%360 ),
        onUpdate:()=>{ gsap.set('.img', { backgroundPosition:(i)=>getBgPos(i) }); }
    });
    
    xPos = Math.round(e.clientX);
}


function dragEnd(e){
    $(window).off('mousemove touchmove', drag);
    gsap.set('.ring', {cursor:'grab'});
    console.log( $(":focus") );
}

//returns the background-position string to create parallax movement in each image
getBgPos = i => { 
    return ( 100-gsap.utils.wrap(0,360,gsap.getProperty('.ring', 'rotationY')-180-i*36)/360*1000 )+'px 0px';
};