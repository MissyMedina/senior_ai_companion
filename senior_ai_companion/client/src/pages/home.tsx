import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Users, 
  Mic, 
  Calendar, 
  Heart, 
  MessageSquare, 
  Phone,
  BookOpen,
  PlayCircle,
  ArrowRight,
  CheckCircle
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-primary mr-3" />
              <h1 className="text-2xl font-semibold text-foreground">FamilyConnect AI</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">
                Features
              </a>
              <a href="#demo" className="text-muted-foreground hover:text-primary transition-colors">
                Demo
              </a>
              <a href="#agents" className="text-muted-foreground hover:text-primary transition-colors">
                Our Agents
              </a>
              <Button asChild>
                <Link href="/grace">Start Free Trial</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="gradient-primary py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-shadow">
              Bridging Generations<br />
              <span className="text-blue-100">Through Voice</span>
            </h2>
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto text-blue-50">
              Connect families across distances with AI agents that understand, remember, and care. 
              Voice-first technology designed for everyone, from tech-savvy adults to their elderly parents.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <Button size="lg" className="bg-white text-primary hover:bg-blue-50 flex items-center">
                <PlayCircle className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                Start Free Trial
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Two AI Agents, One Family
            </h3>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our dual-agent system creates a seamless bridge between generations, 
              adapting to each family member's needs and preferences.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Grace - Elderly Agent */}
            <Card className="gradient-secondary text-white border-0">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mr-4">
                    <Heart className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-white">Grace</CardTitle>
                    <CardDescription className="text-green-100 font-medium">
                      Your Caring Companion
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Mic className="h-5 w-5 text-green-100 mr-3 mt-1" />
                    <div>
                      <h5 className="font-medium text-white">Voice-First Interface</h5>
                      <p className="text-green-100">Simple activation: "Hey Grace" - no buttons, no apps</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MessageSquare className="h-5 w-5 text-green-100 mr-3 mt-1" />
                    <div>
                      <h5 className="font-medium text-white">Memory Assistant</h5>
                      <p className="text-green-100">Gentle reminders and conversation starters</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <BookOpen className="h-5 w-5 text-green-100 mr-3 mt-1" />
                    <div>
                      <h5 className="font-medium text-white">Story Mode</h5>
                      <p className="text-green-100">Share family memories and create new ones</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <Button asChild variant="secondary" className="w-full">
                    <Link href="/grace">Try Grace <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Alex - Family Planner Agent */}
            <Card className="gradient-primary text-white border-0">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mr-4">
                    <Calendar className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-white">Alex</CardTitle>
                    <CardDescription className="text-blue-100 font-medium">
                      Your Family Planner
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-blue-100 mr-3 mt-1" />
                    <div>
                      <h5 className="font-medium text-white">Smart Scheduling</h5>
                      <p className="text-blue-100">Optimal contact timing based on family patterns</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-100 mr-3 mt-1" />
                    <div>
                      <h5 className="font-medium text-white">Gentle Reminders</h5>
                      <p className="text-blue-100">Never miss important moments or conversations</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Heart className="h-5 w-5 text-blue-100 mr-3 mt-1" />
                    <div>
                      <h5 className="font-medium text-white">Family Insights</h5>
                      <p className="text-blue-100">Track emotional wellbeing and health signals</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <Button asChild variant="secondary" className="w-full">
                    <Link href="/alex">Try Alex <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Experience the Connection
            </h3>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              See how our AI agents work together to keep families connected through natural conversation
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-secondary">
                  <Heart className="mr-2 h-5 w-5" />
                  Grace's Interface
                </CardTitle>
                <CardDescription>
                  Designed for elderly users with voice-first interaction
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 voice-pulse cursor-pointer hover:bg-secondary/90 transition-colors">
                    <Mic className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-lg font-medium text-foreground">Say "Hey Grace" to start</p>
                  <Badge variant="secondary" className="mt-2">Voice activation ready</Badge>
                </div>

                <div className="space-y-4">
                  <div className="bg-muted rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <MessageSquare className="h-4 w-4 text-secondary mr-2" />
                      <span className="text-sm font-medium">Recent conversation</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      "Grace, tell me about Tommy's soccer game"
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="h-auto py-3 flex flex-col items-center">
                      <Phone className="h-5 w-5 mb-1" />
                      <span className="text-sm">Call Family</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-3 flex flex-col items-center">
                      <BookOpen className="h-5 w-5 mb-1" />
                      <span className="text-sm">Story Time</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <Calendar className="mr-2 h-5 w-5" />
                  Alex's Dashboard
                </CardTitle>
                <CardDescription>
                  Family planning and insights for caregivers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h5 className="font-medium text-foreground mb-3">Family Status</h5>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-secondary rounded-full mr-2"></div>
                          <span className="text-sm">Mom (Grace)</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">Active 2h ago</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                          <span className="text-sm">Dad</span>
                        </div>
                        <Badge variant="outline" className="text-xs">Call suggested</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted rounded-lg p-4">
                    <h5 className="font-medium text-foreground mb-3">Smart Suggestions</h5>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <p className="font-medium">Perfect time to call</p>
                        <p className="text-muted-foreground">Mom is usually free around 3 PM on Sundays</p>
                      </div>
                      <Button size="sm" variant="link" className="p-0 h-auto">
                        Schedule call
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Agent Communication */}
      <section id="agents" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How Our Agents Work Together
            </h3>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Behind the scenes, Grace and Alex share insights and coordinate to provide the best family experience
            </p>
          </div>

          <div className="bg-muted/50 rounded-2xl p-8 mb-12">
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center space-x-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                    <Heart className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold">Grace</h4>
                  <p className="text-sm text-muted-foreground">Elderly Companion</p>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-8 h-0.5 bg-border"></div>
                  <div className="w-12 h-12 bg-background rounded-full border-2 border-border flex items-center justify-center">
                    <div className="w-6 h-6 bg-primary rounded-full agent-sync"></div>
                  </div>
                  <div className="w-8 h-0.5 bg-border"></div>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                    <Calendar className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold">Alex</h4>
                  <p className="text-sm text-muted-foreground">Family Planner</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <MessageSquare className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h5 className="font-medium mb-2">Share Insights</h5>
                  <p className="text-sm text-muted-foreground">
                    Emotional state, health signals, and conversation patterns
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Calendar className="h-8 w-8 text-secondary mx-auto mb-3" />
                  <h5 className="font-medium mb-2">Coordinate Timing</h5>
                  <p className="text-sm text-muted-foreground">
                    Optimal contact windows and family availability
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Heart className="h-8 w-8 text-accent mx-auto mb-3" />
                  <h5 className="font-medium mb-2">Learn Together</h5>
                  <p className="text-sm text-muted-foreground">
                    Adapt to family preferences and communication styles
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Reconnect Your Family?
          </h3>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join thousands of families who've discovered the joy of staying connected through AI
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <Button size="lg" asChild className="bg-white text-primary hover:bg-blue-50">
              <Link href="/grace">Start Free Trial</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              Schedule Demo
            </Button>
          </div>
          <p className="text-blue-200 text-sm">
            No credit card required • 30-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Users className="h-6 w-6 mr-2" />
                <h4 className="text-xl font-semibold">FamilyConnect AI</h4>
              </div>
              <p className="text-muted mb-4">
                Bridging generations through intelligent conversation and care.
              </p>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">Product</h5>
              <ul className="space-y-2 text-muted">
                <li><a href="#features" className="hover:text-background transition-colors">Features</a></li>
                <li><a href="#demo" className="hover:text-background transition-colors">Demo</a></li>
                <li><a href="#agents" className="hover:text-background transition-colors">Agents</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-muted">
                <li><a href="#" className="hover:text-background transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Accessibility</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">Company</h5>
              <ul className="space-y-2 text-muted">
                <li><a href="#" className="hover:text-background transition-colors">About</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <Separator className="my-8" />
          <div className="text-center text-muted">
            <p>&copy; 2025 FamilyConnect AI. All rights reserved. Built with ❤️ for families everywhere.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
