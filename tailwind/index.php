<?php

// ENQUEUE TAILWIND STYLESHEET, FRONT AND BACK

$tailwind_css =  get_template_directory_uri() . '/css/tailwind.css';

function enqueue_css($css, $cssname)
{
    wp_register_style($cssname, $css, array(), null, 'all');
    wp_enqueue_style($cssname);
}

add_action('wp_enqueue_scripts', function () use ($tailwind_css) {



    enqueue_css($tailwind_css, 'tailwind');
});


add_action('after_setup_theme',  function () use ($tailwind_css) {
    add_editor_style($tailwind_css);
});
