import React from 'react';
import { Container, Typography, Button, Grid, Card, CardContent } from '@mui/material';
import { Link } from 'react-router-dom';
import { ShoppingBag, Security, Support } from '@mui/icons-material';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <Container maxWidth="lg">
          <div className="text-center">
            <Typography variant="h2" component="h1" className="mb-6 font-bold">
              Welcome to Elara
            </Typography>
            <Typography variant="h5" className="mb-8">
              AI-Powered E-Commerce Platform
            </Typography>
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/products"
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              Shop Now
            </Button>
          </div>
        </Container>
      </div>

      {/* Features Section */}
      <Container maxWidth="lg" className="py-16">
        <Typography variant="h3" component="h2" className="text-center mb-12">
          Why Choose Elara?
        </Typography>
        
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card className="h-full text-center p-6">
              <CardContent>
                <ShoppingBag className="text-blue-600 mb-4" style={{ fontSize: 60 }} />
                <Typography variant="h5" component="h3" className="mb-4">
                  Wide Selection
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Discover thousands of products across multiple categories with our extensive catalog.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid size={{ xs: 12, md: 4 }}>
            <Card className="h-full text-center p-6">
              <CardContent>
                <Security className="text-blue-600 mb-4" style={{ fontSize: 60 }} />
                <Typography variant="h5" component="h3" className="mb-4">
                  Secure Shopping
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Shop with confidence using our secure payment system and data protection.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid size={{ xs: 12, md: 4 }}>
            <Card className="h-full text-center p-6">
              <CardContent>
                <Support className="text-blue-600 mb-4" style={{ fontSize: 60 }} />
                <Typography variant="h5" component="h3" className="mb-4">
                  AI Assistant
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Get personalized recommendations and shopping assistance from our AI helper.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* CTA Section */}
      <div className="bg-gray-100 py-16">
        <Container maxWidth="lg">
          <div className="text-center">
            <Typography variant="h4" component="h2" className="mb-6">
              Ready to Start Shopping?
            </Typography>
            <Typography variant="h6" className="mb-8 text-gray-600">
              Join thousands of satisfied customers and discover amazing products.
            </Typography>
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/register"
              className="mr-4"
            >
              Sign Up Now
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={Link}
              to="/products"
            >
              Browse Products
            </Button>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Home;