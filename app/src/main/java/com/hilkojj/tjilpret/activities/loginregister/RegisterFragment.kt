package com.hilkojj.tjilpret.activities.loginregister

import android.os.Bundle
import android.support.constraint.ConstraintLayout
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.inputmethod.EditorInfo
import android.widget.ScrollView
import com.hilkojj.tjilpret.R
import com.hilkojj.tjilpret.Tjilpret
import com.hilkojj.tjilpret.activities.utils.SnackbarUtils

class RegisterFragment : LoginRegisterFragment(1) {

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_register, container, false)
    }

    override fun onStart() {
        super.onStart()

        activity.registerUsername = view!!.findViewById(R.id.register_username)
        activity.registerPassword = view!!.findViewById(R.id.register_password)
        activity.registerMail = view!!.findViewById(R.id.register_mail)

        activity.registerMail.setOnEditorActionListener { _, actionID, _ ->
            if (actionID == EditorInfo.IME_ACTION_DONE) {

                activity.register(activity.registerUsername)
                return@setOnEditorActionListener true
            }
            return@setOnEditorActionListener false
        }

        activity.registerUsername.setOnFocusChangeListener({ view, hasFocus ->

            if (hasFocus)
                return@setOnFocusChangeListener

            val username = activity.registerUsername.text.toString()
            if (username.isNotEmpty()) {

//                Tjilpret.FIREBASE_FUNCS.getHttpsCallable("userExists").call(
//                        hashMapOf("username" to username)
//                ).continueWith { task ->
//
//                    val data = task.result.data as HashMap<*, *>
//                    if (data["exists"] == true)
//                        SnackbarUtils.errorSnackbar(view, "$username bestaat al !!?!", 4000)
//                    else
//                        SnackbarUtils.successSnackbar(view, "$username is beschrikbar", 2000)
//                }
            }
        })

        if (activity.viewPager.currentItem != 1)
            getForm().alpha = 0f
    }

    override fun getTab(): ConstraintLayout {
        return view!!.findViewById(R.id.register_tab) as ConstraintLayout
    }

    override fun getForm(): ScrollView {
        return view!!.findViewById(R.id.register_form) as ScrollView
    }

}
