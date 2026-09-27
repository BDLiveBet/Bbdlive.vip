<?php
/**
 * BDLIVEBET Theme Functions & Definitions
 *
 * @package BDLIVEBET
 * @version 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

define( 'BDLIVEBET_VERSION', '1.0.0' );
define( 'BDLIVEBET_DIR', get_template_directory() );
define( 'BDLIVEBET_URI', get_template_directory_uri() );

/**
 * Sets up theme defaults and registers support for various WordPress features.
 */
function bdlivebet_theme_setup() {
    // Add default posts and comments RSS feed links to head.
    add_theme_support( 'automatic-feed-links' );

    // Let WordPress manage the document title.
    add_theme_support( 'title-tag' );

    // Enable support for Post Thumbnails on posts and pages.
    add_theme_support( 'post-thumbnails' );

    // Switch default core markup for search form, comment form, and comments to output valid HTML5.
    add_theme_support(
        'html5',
        array(
            'search-form',
            'comment-form',
            'comment-list',
            'gallery',
            'caption',
            'style',
            'script',
        )
    );

    // Add support for full and wide align images.
    add_theme_support( 'align-wide' );

    // Add support for responsive embedded content.
    add_theme_support( 'responsive-embeds' );

    // Register navigation menus.
    register_nav_menus(
        array(
            'primary' => esc_html__( 'Primary Navigation Menu', 'bdlivebet' ),
            'footer'  => esc_html__( 'Footer Navigation Menu', 'bdlivebet' ),
            'mobile'  => esc_html__( 'Mobile Navigation Menu', 'bdlivebet' ),
        )
    );
}
add_action( 'after_setup_theme', 'bdlivebet_theme_setup' );

/**
 * Enqueue scripts and styles.
 */
function bdlivebet_enqueue_scripts() {
    // Theme stylesheet
    wp_enqueue_style( 'bdlivebet-theme-style', get_stylesheet_uri(), array(), BDLIVEBET_VERSION );

    // Bundled application CSS
    if ( file_exists( BDLIVEBET_DIR . '/assets/css/bdlivebet.css' ) ) {
        wp_enqueue_style( 'bdlivebet-app-css', BDLIVEBET_URI . '/assets/css/bdlivebet.css', array(), BDLIVEBET_VERSION );
    }

    // Bundled application JS
    if ( file_exists( BDLIVEBET_DIR . '/assets/js/bdlivebet.js' ) ) {
        wp_enqueue_script(
            'bdlivebet-app-js',
            BDLIVEBET_URI . '/assets/js/bdlivebet.js',
            array(),
            BDLIVEBET_VERSION,
            array(
                'strategy'  => 'defer',
                'in_footer' => true,
            )
        );

        $current_user = wp_get_current_user();
        $user_data    = null;
        if ( is_user_logged_in() && $current_user->exists() ) {
            $user_data = array(
                'userId'        => (string) $current_user->ID,
                'username'      => $current_user->user_login,
                'fullName'      => $current_user->display_name ? $current_user->display_name : $current_user->user_login,
                'email'         => $current_user->user_email,
                'walletBalance' => (float) get_user_meta( $current_user->ID, 'bdlivebet_wallet_balance', true ) ?: 2450.00,
                'vipLevel'      => (int) get_user_meta( $current_user->ID, 'bdlivebet_vip_level', true ) ?: 2,
                'avatar'        => get_avatar_url( $current_user->ID ),
            );
        }

        // Localize config object to bridge WordPress state with the frontend app
        wp_localize_script(
            'bdlivebet-app-js',
            'wpBdlivebet',
            array(
                'ajaxUrl'        => admin_url( 'admin-ajax.php' ),
                'restUrl'        => esc_url_raw( rest_url( 'bdlivebet/v1/' ) ),
                'siteUrl'        => site_url(),
                'themeUri'       => BDLIVEBET_URI,
                'nonce'          => wp_create_nonce( 'wp_rest' ),
                'isLoggedIn'     => is_user_logged_in(),
                'currentUser'    => $user_data,
                'appName'        => get_bloginfo( 'name' ),
                'appDescription' => get_bloginfo( 'description' ),
            )
        );
    }
}
add_action( 'wp_enqueue_scripts', 'bdlivebet_enqueue_scripts' );

/**
 * Filter script tag to ensure modern ES module type if needed.
 */
function bdlivebet_add_module_type_to_script( $tag, $handle, $src ) {
    if ( 'bdlivebet-app-js' === $handle ) {
        return '<script type="module" src="' . esc_url( $src ) . '" id="bdlivebet-app-js"></script>';
    }
    return $tag;
}
add_filter( 'script_loader_tag', 'bdlivebet_add_module_type_to_script', 10, 3 );

/**
 * Custom WordPress AJAX endpoints for user authentication & wallet bridge
 */
add_action( 'wp_ajax_bdlivebet_auth_login', 'bdlivebet_handle_ajax_login' );
add_action( 'wp_ajax_nopriv_bdlivebet_auth_login', 'bdlivebet_handle_ajax_login' );
function bdlivebet_handle_ajax_login() {
    check_ajax_referer( 'bdlivebet_nonce', 'nonce', false );

    $phone    = sanitize_text_field( $_POST['phoneNumber'] ?? '' );
    $password = sanitize_text_field( $_POST['password'] ?? '' );

    if ( empty( $phone ) ) {
        wp_send_json_error( array( 'message' => 'Phone number or username required.' ), 400 );
    }

    $user_id = '84739210';
    $user = array(
        'userId'        => $user_id,
        'username'      => $phone,
        'fullName'      => 'শামীম রেজা (VIP)',
        'walletBalance' => 2450.00,
        'vipLevel'      => 2,
        'avatar'        => 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80',
        'createdAt'     => current_time( 'mysql' ),
    );

    wp_send_json_success( array(
        'token' => 'wp_auth_' . wp_generate_password( 32, false ),
        'user'  => $user,
    ) );
}

add_action( 'wp_ajax_bdlivebet_get_wallet', 'bdlivebet_handle_get_wallet' );
add_action( 'wp_ajax_nopriv_bdlivebet_get_wallet', 'bdlivebet_handle_get_wallet' );
function bdlivebet_handle_get_wallet() {
    wp_send_json_success( array(
        'walletBalance' => 2450.00,
        'bonusBalance'  => 120.00,
        'currency'      => 'BDT',
    ) );
}
