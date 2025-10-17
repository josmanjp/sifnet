import React from 'react'

export default function Features(){
    return (
        <div id="features" className="features section">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="features-content">
                            <div className="flex flex-wrap">
                                <div className="w-full md:w-1/2 lg:w-1/4 p-2">
                                    <div className="features-item first-feature wow fadeInUp" data-wow-duration="1s" data-wow-delay="0s">
                                        <div className="first-number number">
                                            <h6>01</h6>
                                        </div>
                                        <div className="icon"></div>
                                        <h4>Mi Carrera</h4>
                                        <div className="line-dec"></div>
                                        <p>T.S.U Informatica. Instituto Universitario de Tecnología de los LLanos. Venezuela. Año 2002</p>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/2 lg:w-1/4 p-2">
                                    <div className="features-item second-feature wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.2s">
                                        <div className="second-number number">
                                            <h6>02</h6>
                                        </div>
                                        <div className="icon"></div>
                                        <h4>Windows</h4>
                                        <div className="line-dec"></div>
                                        <p>Especialista en Desarrollo de Sistemas Administrativos en ambiente Windows. Visual Basic 6.0. Instalacion de S/O Windows, Mantenimiento de Hardware y Software</p>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/2 lg:w-1/4 p-2">
                                    <div className="features-item first-feature wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.4s">
                                        <div className="third-number number">
                                            <h6>03</h6>
                                        </div>
                                        <div className="icon"></div>
                                        <h4>Aplicaciones Web</h4>
                                        <div className="line-dec"></div>
                                        <p>Aplicaciones Web. PHP - Mysql - HTML - CSS, NODEJS - ReactJS, FLUTTER</p>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/2 lg:w-1/4 p-2">
                                    <div className="features-item second-feature last-features-item wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.6s">
                                        <div className="fourth-number number">
                                            <h6>04</h6>
                                        </div>
                                        <div className="icon"></div>
                                        <h4>Aplicaciones Moviles</h4>
                                        <div className="line-dec"></div>
                                        <p>Integracion de aplicaciones web en ambiente Android usando FLUTTER. Desarrollo de aplicaciones moviles multiplataforma.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}