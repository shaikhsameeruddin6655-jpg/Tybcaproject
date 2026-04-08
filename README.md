# Paints Works - Professional Painting Services Management System

A comprehensive web-based platform for managing painting services, including project tracking, customer management, and e-commerce functionality.

## Overview

Paints Works is a full-stack application designed to streamline painting service operations, from customer quotes to project completion. The system includes customer authentication, project management, shopping cart functionality, and order tracking.

## Features

### Core Functionality
- **User Authentication**: Secure login and registration system
- **Project Management**: Track painting projects through various stages
- **E-commerce**: Shopping cart and checkout system
- **Quote Calculator**: Estimate painting costs automatically
- **Order Tracking**: Monitor project progress in real-time
- **Customer Management**: Comprehensive client information system

### Key Modules
- **Authentication System**: Login, registration, password reset
- **Shopping Cart**: Add/remove items, calculate totals, promo codes
- **Project Pipeline**: Visual project tracking (Quoted, In Progress, Drying/Curing, Completed)
- **Estimate Calculator**: Automated cost estimation based on room dimensions
- **Order Management**: Complete order history and status tracking

## Technology Stack

### Frontend
- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with responsive design
- **JavaScript (ES6+):** Core functionality and interactions
- **Font Awesome**: Icon library
- **Google Fonts**: Typography

### Backend (Structure Ready)
- **Node.js/Express**: Server framework (planned)
- **Database**: MongoDB/SQL (planned)
- **REST API**: Backend services (planned)

### Storage
- **localStorage**: Client-side data persistence
- **sessionStorage**: Temporary session data

## Project Structure

```
paints-works/
README.md
backend/
database/
frontend/
  css/
    styles.css
    responsive.css
    cart.css
    checkout.css
    orders.css
    estimate-calculator.css
  js/
    auth.js              # Authentication system
    cart.js              # Shopping cart functionality
    checkout.js          # Checkout process
    estimate-calculator.js # Cost estimation
    login.js             # Login page logic
    main.js              # Core application logic
    orders.js            # Order management
    products.js          # Product display
    project-tracking.js   # Project pipeline
    theme.js             # Theme management
  images/
  index.html            # Homepage
  login.html            # Login page
  register.html         # Registration page
  cart.html             # Shopping cart
  checkout.html         # Checkout process
  products.html         # Product catalog
  product-detail.html   # Product details
  orders.html           # Order history
  estimate-calculator.html # Cost calculator
  wishlist.html         # Saved items
```

## Installation

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (for development)
- Basic understanding of web development

### Setup Instructions

1. **Clone or Download** the project
   ```bash
   git clone <repository-url>
   cd paints-works
   ```

2. **Start Local Server**
   ```bash
   # Using Python
   cd frontend
   python -m http.server 8000

   # Using Node.js
   npx serve frontend -p 8000

   # Using PHP
   php -S localhost:8000 -t frontend/
   ```

3. **Access Application**
   - Open browser to `http://localhost:8000`
   - Navigate through different sections

## Usage Guide

### For Customers

1. **Registration/Login**
   - Visit `/login.html` to sign in
   - Visit `/register.html` to create account
   - Use social login options (Google, Facebook)

2. **Browse Services**
   - Explore painting services on homepage
   - View detailed product information
   - Add services to cart

3. **Get Estimates**
   - Use estimate calculator for cost projections
   - Input room dimensions and requirements
   - Receive instant quote

4. **Manage Orders**
   - Track project progress in real-time
   - View order history
   - Manage saved items

### For Administrators

1. **Project Management**
   - Monitor project pipeline
   - Update project statuses
   - Add project notes

2. **Customer Management**
   - View customer information
   - Track customer orders
   - Manage customer communications

## API Documentation (Planned)

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/forgot-password` - Password reset

### Project Endpoints
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Order Endpoints
- `GET /api/orders` - List orders
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Update order status

## Configuration

### Environment Variables
```javascript
// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// Database Configuration
const DB_CONFIG = {
  host: 'localhost',
  port: 5432,
  database: 'paints_works'
};
```

### Theme Customization
```css
:root {
  --primary-color: #2563eb;
  --secondary-color: #10b981;
  --accent-color: #f59e0b;
  --text-color: #1f2937;
  --background-color: #ffffff;
}
```

## Development

### Code Standards
- Use ES6+ JavaScript features
- Follow semantic HTML5 structure
- Implement responsive design principles
- Maintain consistent naming conventions
- Add proper error handling

### File Organization
- Separate concerns (HTML, CSS, JS)
- Use modular JavaScript architecture
- Implement component-based CSS
- Maintain clear file hierarchy

### Testing
- Manual testing in multiple browsers
- Responsive design testing
- Form validation testing
- Cross-browser compatibility

## Deployment

### Production Setup
1. **Build Process**
   - Minify CSS and JavaScript
   - Optimize images
   - Enable GZIP compression

2. **Server Configuration**
   - Configure HTTPS
   - Set up caching headers
   - Enable security headers

3. **Database Setup**
   - Configure production database
   - Set up backups
   - Monitor performance

## Security Considerations

### Implemented
- Input validation and sanitization
- Password strength requirements
- Session management
- CSRF protection (planned)

### Recommended
- HTTPS implementation
- Rate limiting
- Input sanitization on backend
- Regular security audits

## Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch
3. Make changes with proper testing
4. Submit pull request

### Code Review Process
- Code quality checks
- Functionality testing
- Performance impact assessment
- Security review

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Android Chrome)

## Performance Optimization

### Implemented
- Lazy loading for images
- Optimized CSS delivery
- Efficient JavaScript execution
- Local storage caching

### Future Improvements
- Service Workers for offline support
- Image optimization and WebP format
- Code splitting
- CDN implementation

## Troubleshooting

### Common Issues

1. **Local Server Not Starting**
   - Check port availability
   - Verify Python/Node.js installation
   - Try different port number

2. **JavaScript Errors**
   - Check browser console
   - Verify file paths
   - Clear browser cache

3. **Styling Issues**
   - Check CSS file loading
   - Verify responsive breakpoints
   - Clear browser cache

### Debug Mode
Enable debug mode in browser console:
```javascript
localStorage.setItem('debug', 'true');
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Email: support@paintsworks.com
- Documentation: Available in this README
- Issues: Report via GitHub issues

## Version History

### v1.0.0 (Current)
- Basic authentication system
- Shopping cart functionality
- Project tracking pipeline
- Estimate calculator
- Responsive design

### Planned Features
- Backend API integration
- Real-time notifications
- Advanced reporting
- Mobile app development
- Multi-language support

## Acknowledgments

- Font Awesome for icon library
- Google Fonts for typography
- Open source community for inspiration
- Painting industry professionals for domain expertise

---

**Note**: This is currently a frontend-only application with localStorage for data persistence. Full backend integration is planned for future releases.
