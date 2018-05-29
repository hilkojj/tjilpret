package com.hilkojj.tjilpret.activities.utils

import android.support.v4.app.Fragment
import android.support.v4.app.FragmentManager
import android.support.v4.app.FragmentPagerAdapter

open class ViewPagerAdapter<T : Fragment>(manager: FragmentManager) : FragmentPagerAdapter(manager) {
    val fragmentList = ArrayList<T>()
    val fragmentTitleList = ArrayList<String>()

    override fun getItem(position: Int): Fragment {
        return fragmentList[position]
    }

    override fun getCount(): Int {
        return fragmentList.size
    }

    open fun addFragment(fragment: T, title: String) {
        fragmentList.add(fragment)
        fragmentTitleList.add(title)
    }

    override fun getPageTitle(position: Int): CharSequence {
        return fragmentTitleList[position]
    }
}