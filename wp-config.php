<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the website, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://developer.wordpress.org/advanced-administration/wordpress/wp-config/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'spk' );

/** Database username */
define( 'DB_USER', 'root' );

/** Database password */
define( 'DB_PASSWORD', '' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         'O`U~M.!?;*.jUcHdXGW[xOW-&t76uyjwJIzJrB9~!mwFSu0m/=.q4SJ3F&X}i[Qs' );
define( 'SECURE_AUTH_KEY',  '*W!f9{vJqw46<~&<P ET[`-6eFaxms,kB{)R2VI%7d1h6EL>M#,dP%BHGXehj#^;' );
define( 'LOGGED_IN_KEY',    'eS;hUb+%p;_^=[aOp..v[;_I+Tz;K*|d,]^;srQ}^KFEzj{B[%4/2BK{BMJGGb?Y' );
define( 'NONCE_KEY',        'W?en7l.#D2sMj6O=3R_IydyZ!|_YJ}j<;4FeeD]YLR|)p%O%^X?1CdTkU4#/E:=J' );
define( 'AUTH_SALT',        'Lqes mAM1P$JBp6/*@hKrt(Lj8F =S93H7{8WV6(B_pum<mkAq+e|pPa^/9rP/gm' );
define( 'SECURE_AUTH_SALT', 'N3:j_&:J+xsPa/)>UIamt9UTKMQen/NR(G**kGutK2Q.$jl(M3XjQM;}kwH%RIc|' );
define( 'LOGGED_IN_SALT',   '&+-3hwUsI)/86$+c[l.cMlU@XPMe8<<rBF&,#X?uNi2g[[B6vD`4u/Y3dQgBny:*' );
define( 'NONCE_SALT',       'pc<Ujr,p?bU&oiX%QdR}/bR/F?k`SMUar~,?1!>.o6*>NiClz`?#N.EOk Ps`{jG' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://developer.wordpress.org/advanced-administration/debug/debug-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */



/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
