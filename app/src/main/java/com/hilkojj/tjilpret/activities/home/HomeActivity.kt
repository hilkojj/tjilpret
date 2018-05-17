package com.hilkojj.tjilpret.activities.home

import android.os.Bundle
import android.support.design.widget.AppBarLayout
import android.support.design.widget.TabLayout
import android.support.v4.app.Fragment
import android.support.v4.app.FragmentManager
import android.support.v4.app.FragmentPagerAdapter
import android.support.v4.view.ViewPager
import android.support.v7.app.AppCompatActivity
import android.support.v7.widget.Toolbar
import android.view.animation.AccelerateInterpolator
import com.hilkojj.tjilpret.R


class HomeActivity : AppCompatActivity() {

    lateinit var appbar: AppBarLayout
    lateinit var toolbar: Toolbar
    lateinit var tabLayout: TabLayout
    lateinit var viewPager: ViewPager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_home)

        appbar = findViewById(R.id.home_appbar)
        toolbar = findViewById(R.id.home_toolbar)
        tabLayout = findViewById(R.id.home_tabs)
        viewPager = findViewById(R.id.home_view_pager)
        setSupportActionBar(toolbar)
        setupTabs()
    }

    private fun setupTabs() {
        tabLayout.setupWithViewPager(viewPager)
        val adapter = ViewPagerAdapter(supportFragmentManager)

        val notificationsFragment = NotificationsFragment()
        notificationsFragment.homeActivity = this
        adapter.addFragment(notificationsFragment, "meldingun")

        viewPager.adapter = adapter
    }

    private inner class ViewPagerAdapter(manager: FragmentManager) : FragmentPagerAdapter(manager) {
        private val fragmentList = ArrayList<Fragment>()
        private val fragmentTitleList = ArrayList<String>()

        override fun getItem(position: Int): Fragment {
            return fragmentList[position]
        }

        override fun getCount(): Int {
            return fragmentList.size
        }

        fun addFragment(fragment: Fragment, title: String) {
            fragmentList.add(fragment)
            fragmentTitleList.add(title)
        }

        override fun getPageTitle(position: Int): CharSequence {
            return fragmentTitleList[position]
        }
    }

    private val hideThreshold: Int = 200
    private val showThreshold: Int = -50
    private var scrollDistance: Int = 0
    private var toolbarHidden: Boolean = false

    fun onScroll(delta: Int) {

        if ((delta < 0 && toolbarHidden) || (delta > 0 && !toolbarHidden))
            scrollDistance += delta

        if (scrollDistance > hideThreshold && !toolbarHidden) {

            toolbarHidden = true
            scrollDistance = 0
            appbar.animate().translationY(-toolbar.height.toFloat()).interpolator = AccelerateInterpolator(2f)

        } else if (scrollDistance < showThreshold && toolbarHidden) {

            toolbarHidden = false
            scrollDistance = 0
            appbar.animate().translationY(0f).interpolator = AccelerateInterpolator(4f)
        }
    }

}
