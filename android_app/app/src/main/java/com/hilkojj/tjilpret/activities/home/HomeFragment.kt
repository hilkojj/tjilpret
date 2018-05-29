package com.hilkojj.tjilpret.activities.home

import android.support.v4.app.Fragment
import android.widget.ScrollView

abstract class HomeFragment(var backgroundIsPrimaryColor: Boolean) : Fragment() {

    var homeActivity: HomeActivity? = null
    var scrollView: ScrollView? = null

    override fun onStart() {

        super.onStart()

        if (homeActivity != null && scrollView != null) {

            scrollView?.viewTreeObserver?.addOnScrollChangedListener {
                homeActivity!!.onScroll(this, backgroundIsPrimaryColor)
            }
        }
    }

}
