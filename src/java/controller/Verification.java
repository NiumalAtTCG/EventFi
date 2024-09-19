/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import dto.Response_DTO;
import dto.User_DTO;
import entity.User;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.HibernateUtil;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author User
 */
@WebServlet(name = "Verification", urlPatterns = {"/Verification"})
public class Verification extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Response_DTO response_DTO = new Response_DTO();

        Gson gson = new Gson();
        JsonObject dto = gson.fromJson(request.getReader(), JsonObject.class);

        String verification = dto.get("verification").getAsString();

        if (request.getSession().getAttribute("email") != null) {
            //email session available

            String email = request.getSession().getAttribute("email").toString();

            Session session = HibernateUtil.getSessionFactory().openSession();
            Criteria criteria1 = session.createCriteria(User.class);
            criteria1.add(Restrictions.eq("email", email));
            criteria1.add(Restrictions.eq("verification", verification));

            if (!criteria1.list().isEmpty()) {
                //verified

                User user = (User) criteria1.list().get(0);
                user.setVerification("Verified");

                session.update(user);
                session.beginTransaction().commit();

                request.getSession().removeAttribute("email");

                User_DTO user_DTO = new User_DTO();
                user_DTO.setFname(user.getFname());
                user_DTO.setLname(user.getLname());
                user_DTO.setPassword(null);
                request.getSession().setAttribute("user", user_DTO);

                response_DTO.setSuccess(true);
                response_DTO.setContent("Verification success");

            } else {
                //verification wrong
                response_DTO.setContent("Invalid verification code!");

            }

        } else {
            //email session not available
            response_DTO.setContent("Verification unavailable! Please Sign In");

        }
        
        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(response_DTO));
        System.out.println(gson.toJson(response_DTO));
    }

}
