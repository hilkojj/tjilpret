package com.hilkojj.tjilpret.activities.home

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ScrollView
import com.bumptech.glide.Glide
import com.bumptech.glide.request.RequestOptions
import com.hilkojj.tjilpret.R

class NotificationsFragment: HomeFragment() {

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_notifications, container, false)
    }

    override fun onStart() {

        scrollView = view as ScrollView

        Glide.with(this).load("https://i.giphy.com/media/8rE46GISKreDDKUbMF/giphy-downsized.gif")
                .apply(RequestOptions.circleCropTransform())
                .into(view!!.findViewById(R.id.glide_test))

        super.onStart()
    }

}