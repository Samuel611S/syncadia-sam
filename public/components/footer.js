// Footer displayed on all pages 
class CustomFooter extends HTMLElement {
    connectedCallback() {
        //inner HTML content
        this.innerHTML = `
            <footer class="footer py-4">
                <div class="container">
                    <div class="row">
                        <div class="col-md-3">
                            <h5>Syncadia</h5>
                            <ul class="list-unstyled">
                                <li><a href="#"><i class="fab fa-facebook"></i> Facebook</a></li>
                                <li><a href="#"><i class="fab fa-linkedin"></i> LinkedIn</a></li>
                                <li><a href="#"><i class="fab fa-twitter"></i> Twitter</a></li>
                                <li><a href="#"><i class="fab fa-instagram"></i> Instagram</a></li>
                            </ul>
                        </div>
                        <div class="col-md-3">
                            <h5>Resources</h5>
                            <ul class="list-unstyled">
                                <li><a href="#">Pricing</a></li>
                                <li><a href="#">FAQs</a></li>
                                <li><a href="#">Help center</a></li>
                            </ul>
                        </div>
                        <div class="col-md-3">
                            <h5>Company</h5>
                            <ul class="list-unstyled">
                                <li><a href="#">About us</a></li>
                                <li><a href="#">Join our team!</a></li>
                                <li><a href="#">Press</a></li>
                            </ul>
                        </div>
                        <div class="col-md-3">
                            <h5>Features</h5>
                            <ul class="list-unstyled">
                                <li><a href="#">Watch Demo Here!</a></li>
                                <li><a href="#">Upgrade to Pro!</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
        `
    }
}
//Defining the footer to be recognized in DOM
customElements.define('custom-footer', CustomFooter);