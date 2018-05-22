package com.hilkojj.tjilpret.activities.chooseuser

import android.content.Intent
import android.graphics.drawable.AnimationDrawable
import android.os.Bundle
import android.support.v7.app.AppCompatActivity
import android.support.v7.widget.DefaultItemAnimator
import android.support.v7.widget.LinearLayoutManager
import android.support.v7.widget.RecyclerView
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.animation.AccelerateInterpolator
import android.widget.ProgressBar
import android.widget.TextView
import com.hilkojj.tjilpret.R
import com.hilkojj.tjilpret.Tjilpret
import com.hilkojj.tjilpret.UserSession
import com.hilkojj.tjilpret.activities.home.HomeActivity
import com.hilkojj.tjilpret.activities.loginregister.LoginRegisterActivity

class ChooseUserActivity : AppCompatActivity() {

    inner class ChooseUserAdapter : RecyclerView.Adapter<ChooseUserAdapter.ViewHolder>() {

        val usernames: ArrayList<String> = ArrayList()

        inner class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {

            var usernameView: TextView = itemView.findViewById(R.id.choose_user_row_username)

            init {
                itemView.setOnClickListener {
                    choose(usernameView.text.toString())
                }
            }

        }

        override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
            return ViewHolder(
                    LayoutInflater.from(parent.context).inflate(R.layout.row_choose_user, parent, false)
            )
        }

        override fun getItemCount(): Int {
            return usernames.size
        }

        override fun onBindViewHolder(holder: ViewHolder, position: Int) {
            println(position)
            holder.usernameView.text = usernames[position]
        }

    }

    private var chosen = false
    lateinit var recyclerView: RecyclerView
    lateinit var adapter: ChooseUserAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_choose_user)

        val animationDrawable = findViewById<View>(R.id.choose_user_view).background as AnimationDrawable
        animationDrawable.setEnterFadeDuration(2000)
        animationDrawable.setExitFadeDuration(4000)
        animationDrawable.start()

        recyclerView = findViewById(R.id.choose_user_recycler)
        recyclerView.layoutManager = LinearLayoutManager(applicationContext)
        recyclerView.itemAnimator = DefaultItemAnimator()
        adapter = ChooseUserAdapter()
        recyclerView.adapter = adapter

        val tokens = HashMap<String, String>()
        val storedUsers = Tjilpret.prefs.getStringSet("stored_users", setOf())

        for (user in storedUsers)
            tokens[user] = Tjilpret.prefs.getString("user_token->$user", "")

//        Tjilpret.callHttpsFunction("checkTokens", hashMapOf(
//                "checkTokens" to tokens
//        )).continueWith { task ->
//
//            findViewById<ProgressBar>(
//                    R.id.choose_user_progress_bar
//            ).animate().alpha(0f).interpolator = AccelerateInterpolator(2f)
//
//            val results = task.result.data as HashMap<*, *>
//            for (user in storedUsers) {
//
//                if (results[user] == true) { // valid token -> add to RecyclerView
//
//                    adapter.usernames.add(user)
//                    println("token for $user is still valid")
//
//                } else // invalid token -> remove from prefs
//                    Tjilpret.removeStoredUser(user)
//            }
//            adapter.notifyDataSetChanged()
//            recyclerView.animate().alpha(1f).setDuration(200).setInterpolator(AccelerateInterpolator(2f))
//        }
    }

    fun addAnother(view: View) {
        if (chosen)
            return
        chosen = true
        startActivity(Intent(this, LoginRegisterActivity::class.java))
        finish()
    }

    fun choose(username: String) {
        if (chosen)
            return
        chosen = true
//        Tjilpret.session = UserSession(username, Tjilpret.prefs.getString("user_token->$username", ""))
//        startActivity(Intent(this, HomeActivity::class.java))
        finish()
    }

}
