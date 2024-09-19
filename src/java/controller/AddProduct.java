/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import dto.Response_DTO;
import dto.User_DTO;
import entity.Category;
import entity.Event;
import entity.Product;
import entity.Product_Status;
import entity.User;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import model.HibernateUtil;
import model.Validations;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

@MultipartConfig
@WebServlet(name = "AddProduct", urlPatterns = {"/AddProduct"})
public class AddProduct extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        try {
            Response_DTO response_DTO = new Response_DTO();
            Gson gson = new Gson();
            
            String user1 = request.getParameter("user");
            response.getWriter().write(user1);
            
            String categoryId = request.getParameter("categoryId");
            String eventId = request.getParameter("eventId");
            String title = request.getParameter("title");
            String description = request.getParameter("description");
            String eventOn = request.getParameter("eventOn");
            SimpleDateFormat formatter =new SimpleDateFormat("yyyy-MM-dd");
            Date date = formatter.parse(eventOn);
            
            String eventAt = request.getParameter("eventAt");
            String price = request.getParameter("price");
            String quantity = request.getParameter("quantity");
            Part image = request.getPart("image");
            
            
            
            Session session = HibernateUtil.getSessionFactory().openSession();
            if (!Validations.isInteger(categoryId)) {
                response_DTO.setContent("Invalid Category");
                
            } else if (!Validations.isInteger(eventId)) {
                response_DTO.setContent("Invalid Event");
                
            } else if (title.isEmpty()) {
                response_DTO.setContent("Please fill Title");
                
            } else if (eventOn.isEmpty()) {
                response_DTO.setContent("Please select Date");
                
            } else if (description.isEmpty()) {
                response_DTO.setContent("Please fill Description");
                
            } else if (price.isEmpty()) {
                response_DTO.setContent("Please fill Price");
                
            } else if (!Validations.isDouble(price)) {
                response_DTO.setContent("Invalid Price");
                
            } else if (Double.parseDouble(price) <= 0) {
                response_DTO.setContent("Price must be greater than 0");
                
            } else if (quantity.isEmpty()) {
                response_DTO.setContent("Please fill Quanity");
                
            } else if (!Validations.isInteger(quantity)) {
                response_DTO.setContent("Invalid Quanity");
                
            } else if (Integer.parseInt(quantity) <= 0) {
                response_DTO.setContent("Quantity must be greater than 0");
                
            } else if (eventAt.isEmpty()) {
                response_DTO.setContent("Please fill EventAt");
                
            } else if (image.getSubmittedFileName() == null) {
                response_DTO.setContent("Please upload Image 1");
                
            } else {
                
                Category category = (Category) session.get(Category.class, Integer.parseInt(categoryId));
                
                if (category == null) {
                    response_DTO.setContent("Please Select a Valid Category");
                } else {
                    
                    Event event = (Event) session.get(Event.class, Integer.parseInt(eventId));
                    
                    if (event == null) {
                        response_DTO.setContent("Please Select a Valid Model");
                    } else {
                        
                        if (event.getCategory().getId() != category.getId()) {
                            response_DTO.setContent("Please Select a Valid Model");
                        } else {
                            
                            
                            Product product = new Product();
                            product.setDate_time(date);
                            product.setDescription(description);
                            product.setEvent(event);
                            product.setLocation(eventAt);
                            product.setPrice(Double.parseDouble(price));
                            
                            
                            
                            //get Active status
                            Product_Status product_Status = (Product_Status) session.load(Product_Status.class, 1);
                            product.setProduct_status(product_Status);
                            
                            product.setQty(Integer.parseInt(quantity));
                            product.setTitle(title);
                            
                            //get user
                            User_DTO user_DTO = (User_DTO) request.getSession().getAttribute("user");
                            Criteria criteria1 = session.createCriteria(User.class);
                            criteria1.add(Restrictions.eq("email", user_DTO.getEmail()));
                            User user = (User) criteria1.uniqueResult();
                            product.setUser(user);
                            
                            int pid = (int) session.save(product);
                            session.beginTransaction().commit();
                            
                            String applicationPath = request.getServletContext().getRealPath("");
                            
                            String newApplicationPath = applicationPath.replace("build" + File.separator + "web", "web");
                            File folder = new File(newApplicationPath + "//product-images//" + pid);
                            folder.mkdir();
                            
                            File file1 = new File(folder, pid + "image.png");
                            InputStream inputStream1 = image.getInputStream();
                            Files.copy(inputStream1, file1.toPath(), StandardCopyOption.REPLACE_EXISTING);
                            
                            response_DTO.setSuccess(true);
                            response_DTO.setContent("New Product Added");
                            
                            
                            
                        }
                    }
                }
            }
            response.setContentType("application/json");
            response.getWriter().write(gson.toJson(response_DTO));
            System.out.println(gson.toJson(response_DTO));
            session.close();
        } catch (ParseException ex) {
            Logger.getLogger(AddProduct.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
}
