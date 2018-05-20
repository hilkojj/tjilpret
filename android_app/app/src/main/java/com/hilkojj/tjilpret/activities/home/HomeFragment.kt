package com.hilkojj.tjilpret.activities.home

import android.support.v4.app.Fragment
import android.widget.ScrollView

abstract class HomeFragment : Fragment() {

    var homeActivity: HomeActivity? = null
    var scrollView: ScrollView? = null
    var prevY: Int = 0

    override fun onStart() {

        super.onStart()

        if (homeActivity != null && scrollView != null) {

            scrollView?.viewTreeObserver?.addOnScrollChangedListener {

                val newY = scrollView?.scrollY ?: 0
                val delta = newY - prevY
                homeActivity?.onScroll(delta)
                prevY = newY
            }
        }
    }

}
