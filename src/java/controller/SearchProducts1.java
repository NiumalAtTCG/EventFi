/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import entity.Address;
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
@WebServlet(name = "SearchProducts1", urlPatterns = {"/SearchProducts1"})
public class SearchProducts1 extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
         
       
        Gson gson = new Gson();

        JsonObject responseJsonObject = new JsonObject();
        responseJsonObject.addProperty("success", false);

        //get request data
        JsonObject requestJsonObject = gson.fromJson(request.getReader(), JsonObject.class);
        System.out.println(responseJsonObject);

        Session session = HibernateUtil.getSessionFactory().openSession();

        //search all products
        Criteria criteria1 = session.createCriteria(Product.class);

        //add category filter
        if (requestJsonObject.has("categorySelect")) {

            //category selected
            String category_name = requestJsonObject.get("categorySelect").getAsString();

            //get category from db
            Criteria criteria2 = session.createCriteria(Category.class);
            criteria2.add(Restrictions.eq("name", category_name));
            Category category = (Category) criteria2.uniqueResult();

            //filter models by category from db
            Criteria criteria3 = session.createCriteria(Event.class);
            criteria3.add(Restrictions.eq("category", category));
            List<Event> eventlList = criteria3.list();

            //filter products by model list from db
            criteria1.add(Restrictions.in("event", eventlList));

        }


        //add color filter

        //add storage filter



        //filter products by sorting from db
        String sort_text = requestJsonObject.get("sort_text").getAsString();
       
        
        if (sort_text.equals("Resent Events")) {
            
            criteria1.addOrder(Order.asc("date_time"));
            
        } else if (sort_text.equals("Upcoming Events")) {
            
            criteria1.addOrder(Order.desc("date_time"));
            
        } else if (sort_text.equals("Sort by Name")) {
            
            criteria1.addOrder(Order.asc("title"));
            
        } else if (sort_text.equals("Sort by Price")) {
            
            criteria1.addOrder(Order.asc("price"));
            
        }
        
        //get all product count
        responseJsonObject.addProperty("allProductCount", criteria1.list().size());

        //set product range
        int firstResult = requestJsonObject.get("firstResult").getAsInt();
        criteria1.setFirstResult(firstResult);
        criteria1.setMaxResults(4);
        
        //get product list
        List<Product> productList = criteria1.list();
        
        //remove users from product list
        for (Product product : productList) {
            product.setUser(null);
        }
        
        responseJsonObject.add("productList", gson.toJsonTree(productList));
        responseJsonObject.addProperty("success", true);

        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responseJsonObject));

    }

}
