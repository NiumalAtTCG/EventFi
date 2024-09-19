/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import entity.Category;
import entity.Event;
import entity.Product;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.HibernateUtil;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author User
 */
@WebServlet(name = "LoadiIndexCategoryList", urlPatterns = {"/LoadiIndexCategoryList"})
public class LoadiIndexCategoryList extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        Gson gson = new Gson();
        Session session = HibernateUtil.getSessionFactory().openSession();
        try {
            
            
            Criteria criteria2 = session.createCriteria(Category.class);
            
            

            Criteria criteria1 = session.createCriteria(Product.class);
         
            List<Product> productList= criteria1.list();
            
               for (Product product1 : productList) {
                    product1.getUser().setPassword(null);
                    product1.getUser().setVerification(null);
                    product1.getUser().setEmail(null);
                    
                }

           
              JsonObject jsonObject = new JsonObject();
           
                jsonObject.add("productList", gson.toJsonTree(productList));
             

            response.setContentType("application/json");
            response.getWriter().write(gson.toJson(jsonObject));
            session.close();

        } catch (Exception e) {
        }
    }

}
