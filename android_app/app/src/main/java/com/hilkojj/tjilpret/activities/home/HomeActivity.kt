package com.hilkojj.tjilpret.activities.home

import android.os.Bundle
import android.support.design.widget.AppBarLayout
import android.support.design.widget.TabLayout
import android.support.v4.view.ViewPager
import android.support.v4.widget.DrawerLayout
import android.support.v7.widget.Toolbar
import android.view.Gravity
import android.view.View
import android.view.animation.AccelerateInterpolator
import android.widget.ImageView
import android.widget.TextView
import com.bumptech.glide.Glide
import com.bumptech.glide.request.RequestOptions
import com.hilkojj.tjilpret.R
import com.hilkojj.tjilpret.Tjilpret
import com.hilkojj.tjilpret.User
import com.hilkojj.tjilpret.activities.UserSessionActivity
import com.hilkojj.tjilpret.activities.utils.ThemeColors
import com.hilkojj.tjilpret.activities.utils.ViewPagerAdapter


class HomeActivity : UserSessionActivity() {

    lateinit var appbar: AppBarLayout
    lateinit var toolbar: Toolbar
    lateinit var tabLayout: TabLayout
    lateinit var viewPager: ViewPager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        ThemeColors(this, session.user.r, session.user.g, session.user.b)
        setContentView(R.layout.activity_home)

        appbar = findViewById(R.id.home_appbar)
        toolbar = findViewById(R.id.home_toolbar)
        tabLayout = findViewById(R.id.home_tabs)
        viewPager = findViewById(R.id.home_view_pager)
        setupTabs()

        Glide.with(this).load(Tjilpret.userSession!!.user.profilePicPath(User.ProfilePicSize.SMALL))
                .apply(RequestOptions.circleCropTransform())
                .into(findViewById(R.id.appbar_profile_pic))
    }

    private fun setupTabs() {
        tabLayout.setupWithViewPager(viewPager)
        val adapter = ViewPagerAdapter(supportFragmentManager)

        var notificationsFragment = NotificationsFragment()
        notificationsFragment.homeActivity = this
        adapter.addFragment(notificationsFragment, "meldingun")

        notificationsFragment = NotificationsFragment()
        notificationsFragment.homeActivity = this
        adapter.addFragment(notificationsFragment, "poep")

        notificationsFragment = NotificationsFragment()
        notificationsFragment.homeActivity = this
        adapter.addFragment(notificationsFragment, "poep1")

        notificationsFragment = NotificationsFragment()
        notificationsFragment.homeActivity = this
        adapter.addFragment(notificationsFragment, "poep2")

        viewPager.adapter = adapter

        val icons = intArrayOf(
                R.drawable.ic_home_white_24dp,
                R.drawable.ic_subscriptions_white_24dp,
                R.drawable.ic_chat_bubble_white_24dp,
                R.drawable.ic_group_white_24dp
        )

        for (i in 0 until tabLayout.tabCount) {
            val view = View.inflate(
                    this, R.layout.fragment_home_notification_tab, null
            )
            tabLayout.getTabAt(i)!!.customView = view
            view.findViewById<ImageView>(R.id.tab_icon).setImageResource(
                    icons[i]
            )
            view.findViewById<TextView>(R.id.notifications_tab_n).alpha = 0f
            view.findViewById<ImageView>(R.id.notifications_tab_circle).alpha = 0f
        }
    }

    fun setNotificationBadge(tabIndex: Int, n: Int) {
        val customView = tabLayout.getTabAt(tabIndex)!!.customView!!

        val text = customView.findViewById<TextView>(R.id.notifications_tab_n)
        val circle = customView.findViewById<ImageView>(R.id.notifications_tab_circle)

        text.text = n.toString()
        text.animate().alpha(if (n == 0) 0f else 1f).setDuration(100).start()
        circle.animate().alpha(if (n == 0) 0f else 1f).setDuration(100).start()
    }

    private val hideThreshold: Int = 200
    private val showThreshold: Int = -50
    private var scrollDistance: Int = 0
    private var toolbarHidden: Boolean = false

    fun onScroll(delta: Int, scrollTop: Int, backgroundIsPrimaryColor: Boolean) {

        if ((delta < 0 && toolbarHidden) || (delta > 0 && !toolbarHidden))
            scrollDistance += delta

        if (scrollDistance > hideThreshold && !toolbarHidden) {

            setNotificationBadge(1, 0)
            setNotificationBadge(0, 8)
            setNotificationBadge(2, 5)
            toolbarHidden = true
            scrollDistance = 0
            appbar.animate().translationY(-toolbar.height.toFloat()).interpolator = AccelerateInterpolator(2f)

        } else if (scrollDistance < showThreshold && toolbarHidden) {

            toolbarHidden = false
            scrollDistance = 0
            appbar.animate().translationY(0f).interpolator = AccelerateInterpolator(4f)
        }

        appbar.elevation = if (scrollTop < 10 && backgroundIsPrimaryColor) 1f else 10.5f
    }

    fun showNavView(view: View) {
        findViewById<DrawerLayout>(R.id.home_drawer).openDrawer(Gravity.LEFT)
    }

}
