import { LyvelyServer } from '@lyvely/api';
import { LegalModule } from './legal.module';
import { lyvelyDevConfig } from '@lyvely/devtools';

lyvelyDevConfig.modules = {
  legal: {
    poweredBy: true,
    sections: {
      imprint: {
        label: 'Imprint/Terms',
        version: '1.0',
        content:
          '<h1>Imprint</h1><h2>Test Imprint</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam maximus orci diam, vitae mollis nibh ultricies nec. Donec aliquet massa dignissim dapibus imperdiet. Mauris in accumsan tellus, nec vulputate nulla. Maecenas congue mauris et nisi hendrerit fermentum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sed pretium ex.</p>',
        format: 'html',
        locales: {
          de: {
            label: 'Impressum/Nutzungsbedingungen',
            content:
              '<h1>Impressum</h1><h2>Test Impressum</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam maximus orci diam, vitae mollis nibh ultricies nec. Donec aliquet massa dignissim dapibus imperdiet. Mauris in accumsan tellus, nec vulputate nulla. Maecenas congue mauris et nisi hendrerit fermentum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sed pretium ex.</p>',
            version: '1.0',
            format: 'html',
          },
          en: {
            label: 'Imprint',
            content:
              '<h1>Imprint</h1><h2>Test Imprint</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam maximus orci diam, vitae mollis nibh ultricies nec. Donec aliquet massa dignissim dapibus imperdiet. Mauris in accumsan tellus, nec vulputate nulla. Maecenas congue mauris et nisi hendrerit fermentum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sed pretium ex.</p>',
            version: '1.0',
            format: 'html',
          },
        },
      },
      privacy: {
        label: 'Privacy',
        version: '1.0',
        content:
          '<h1>Privacy</h1><h2>Test Privacy</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam maximus orci diam, vitae mollis nibh ultricies nec. Donec aliquet massa dignissim dapibus imperdiet. Mauris in accumsan tellus, nec vulputate nulla. Maecenas congue mauris et nisi hendrerit fermentum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sed pretium ex.</p>',
        format: 'html',
        locales: {
          de: {
            label: 'Privatsphäre',
            content:
              '<h1>Privatsphäre</h1><h2>Test Privatsphäre</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam maximus orci diam, vitae mollis nibh ultricies nec. Donec aliquet massa dignissim dapibus imperdiet. Mauris in accumsan tellus, nec vulputate nulla. Maecenas congue mauris et nisi hendrerit fermentum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sed pretium ex.</p>',
            version: '1.0',
            format: 'html',
          },
          en: {
            label: 'Privacy',
            content:
              '<h1>Privacy</h1><h2>Test Privacy</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam maximus orci diam, vitae mollis nibh ultricies nec. Donec aliquet massa dignissim dapibus imperdiet. Mauris in accumsan tellus, nec vulputate nulla. Maecenas congue mauris et nisi hendrerit fermentum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sed pretium ex.</p>',
            version: '1.0',
            format: 'html',
          },
        },
      },
      cookies: {
        label: 'Cookies',
        version: '1.0',
        content:
          '<h1>Cookies</h1><h2>Test Cookies</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam maximus orci diam, vitae mollis nibh ultricies nec. Donec aliquet massa dignissim dapibus imperdiet. Mauris in accumsan tellus, nec vulputate nulla. Maecenas congue mauris et nisi hendrerit fermentum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sed pretium ex.</p>',
        format: 'html',
        locales: {
          de: {
            label: 'Cookies',
            content:
              '<h1>Cookies</h1><h2>Test Cookies</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam maximus orci diam, vitae mollis nibh ultricies nec. Donec aliquet massa dignissim dapibus imperdiet. Mauris in accumsan tellus, nec vulputate nulla. Maecenas congue mauris et nisi hendrerit fermentum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sed pretium ex.</p>',
            version: '1.0',
            format: 'html',
          },
          en: {
            label: 'Cookies',
            content:
              '<h1>Cookies</h1><h2>Test Cookies</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam maximus orci diam, vitae mollis nibh ultricies nec. Donec aliquet massa dignissim dapibus imperdiet. Mauris in accumsan tellus, nec vulputate nulla. Maecenas congue mauris et nisi hendrerit fermentum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sed pretium ex.</p>',
            version: '1.0',
            format: 'html',
          },
        },
      },
    },
  },
};

new LyvelyServer().bootstrap({
  serveStatic: false,
  configFiles: false,
  config: lyvelyDevConfig,
  modules: [LegalModule],
});
