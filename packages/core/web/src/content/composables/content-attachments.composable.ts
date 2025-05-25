import { useContentClient, ContentModel } from '@lyvely/interface';

export const useContentAttachments = (content: ContentModel) => {
  const uploadAttachment = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.addEventListener('change', async (event) => {
      const files = input.files;

      if (files && files.length > 0) {
        const file = files[0];
        try {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('contentId', content.id);
          const uploadResponse = await useContentClient().attachFile(content.id, formData);
          console.log('File uploaded successfully:', uploadResponse);
        } catch (error) {
          console.error('File upload failed:', error);
        }
      }
    });

    input.click();
  };

  return {
    uploadAttachment,
  };
};
