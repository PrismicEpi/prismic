import { jest } from '@jest/globals'; 
import request from 'supertest';

let app;
let ExperimentModel;

beforeAll(async () => {
  jest.unstable_mockModule('../models/experimentModel.js', () => ({
    ExperimentModel: {
      findAll: jest.fn(),
      create: jest.fn(),
      destroy: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn()
    }
  }));

  ({ ExperimentModel } = await import('../models/experimentModel.js'));
  app = (await import('../app.js')).default;
});

describe('Experiment Controller', () => {
  const experimentData = {
    experiment_id: '1234',
    user_email: 'test@example.com',
    input_txt: 'Test experiment',
    experiment_date_start: '2025-05-01',
    experiment_date_end: '2025-05-02',
    laser_config: 'Laser A',
    environment_config: 'Environment B'
  };

  let createdExperimentId = '1234'; 

  describe('GET /api/experiments', () => {
    it('should return all experiments', async () => {
      ExperimentModel.findAll.mockResolvedValue([experimentData]);

      const response = await request(app).get('/api/experiments');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([experimentData]);
    });

    it('should return 500 if an error occurs', async () => {
      ExperimentModel.findAll.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/experiments');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Internal server error');
    });
  });

  describe('GET /api/experiment', () => {
    it('should fetch an experiment by its ID', async () => {
      ExperimentModel.findOne.mockResolvedValue(experimentData);

      const response = await request(app)
        .get('/api/experiment/get-by-experiment-id')
        .query({ experiment_id: experimentData.experiment_id });

      expect(response.status).toBe(200);
      expect(response.body.experiment_id).toBe(experimentData.experiment_id);
    });

    it('should fetch experiments by user email', async () => {
      ExperimentModel.findAll.mockResolvedValue([experimentData]);

      const response = await request(app)
        .get('/api/experiments/get-by-user-mail')
        .query({ user_email: 'testuser@example.com' });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return 400 if user_email is missing', async () => {
        const response = await request(app)
          .get('/api/experiments/get-by-user-mail')
          .query({});
    
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('user_email is required');
      });
    
      it('should return 500 if an error occurs during fetching experiments', async () => {
        ExperimentModel.findAll.mockRejectedValue(new Error('Database error'));
    
        const response = await request(app)
          .get('/api/experiments/get-by-user-mail')
          .query({ user_email: 'testuser@example.com' });
    
        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Internal server error');
      });

    it('should return 400 if experiment_id is missing', async () => {
      const response = await request(app).get('/api/experiment/get-by-experiment-id');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('experiment_id is required');
    });

    it('should return 500 if an error occurs during fetching the experiment', async () => {
        ExperimentModel.findOne.mockRejectedValue(new Error('Database error'));
    
        const response = await request(app)
          .get('/api/experiment/get-by-experiment-id')
          .query({ experiment_id: '1234' });
    
        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Internal server error');
      });

    it('should return 404 if experiment not found', async () => {
      ExperimentModel.findOne.mockResolvedValue(null);

      const response = await request(app).get(`/api/experiment/get-by-experiment-id?experiment_id=9999`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Experiment not found');
    });
  });

  describe('POST /api/experiment', () => {
    it('should create a new experiment', async () => {
      ExperimentModel.create.mockResolvedValue({
        ...experimentData,
        experiment_id: createdExperimentId 
      });

      const response = await request(app)
        .post('/api/experiment')
        .send(experimentData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('experiment_id');
    });

    it('should return 500 if an error occurs during creation', async () => {
      ExperimentModel.create.mockRejectedValue(new Error('Database error'));

      const response = await request(app).post('/api/experiment').send(experimentData);

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Internal server error');
    });
  });

  describe('PATCH /api/experiment', () => {
    it('should update an experiment successfully', async () => {
      const mockUpdate = jest.fn().mockResolvedValue();
      
      ExperimentModel.findOne = jest.fn().mockResolvedValue({
        experiment_id: createdExperimentId,
        graph_history: [0.5, 0.6],
        update: jest.fn().mockResolvedValue(),
      });
  
      const updateData = {
        experiment_id: createdExperimentId,
        updateFields: {
          status: 'COMPLETED',
          result_txt: 'Test result',
          graph_history: [0.75, 1.2],
        },
      };
  
      const response = await request(app)
        .patch('/api/experiment')
        .send(updateData);
  
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Experiment updated successfully');
    });
  
    it('should return 400 if graph_history is invalid', async () => {
      const updateData = {
        experiment_id: createdExperimentId,
        updateFields: {
          status: 'COMPLETED',
          result_txt: 'Test result',
          graph_history: [0.75], 
        },
      };
  
      const response = await request(app)
        .patch('/api/experiment')
        .send(updateData);
  
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('graph_history must be an array of exactly two floats');
    });
  
    it('should return 404 if experiment not found for update', async () => {
      ExperimentModel.findOne.mockResolvedValue(null);
  
      const updateData = {
        experiment_id: '9999',
        updateFields: { status: 'COMPLETED', result_txt: 'Test result' },
      };
  
      const response = await request(app)
        .patch('/api/experiment')
        .send(updateData);
  
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Experiment not found');
    });

    it('should return 400 if updateFields is empty', async () => {
        const updateData = {
          experiment_id: createdExperimentId,
          updateFields: {},
        };
    
        const response = await request(app)
          .patch('/api/experiment')
          .send(updateData);
    
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('No fields provided for update');
      });

    it('should return 400 if experiment_id is missing', async () => {
        const updateData = {
          updateFields: {
            status: 'COMPLETED',
            result_txt: 'Test result',
            graph_history: [0.75, 1.2],
          },
        };
    
        const response = await request(app)
          .patch('/api/experiment')
          .send(updateData);
    
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('experiment_id is required');
      });
  
    it('should return 500 if an error occurs during update', async () => {
      ExperimentModel.findOne.mockResolvedValue({
        experiment_id: createdExperimentId,
        graph_history: [0.5, 0.6],
        update: jest.fn().mockRejectedValue(new Error('Database error')),
      });
  
      const updateData = {
        experiment_id: createdExperimentId,
        updateFields: {
          status: 'COMPLETED',
          result_txt: 'Test result',
          graph_history: [0.75, 1.2],
        },
      };
  
      const response = await request(app)
        .patch('/api/experiment')
        .send(updateData);
  
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Internal server error');
    });
  });
  

  describe('DELETE /api/experiment', () => {
    it('should delete an experiment by its ID', async () => {
      ExperimentModel.destroy.mockResolvedValue(1); 

      const response = await request(app)
        .delete('/api/experiment/delete-by-experiment-id')
        .send({ experiment_id: createdExperimentId });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Experiment deleted successfully');
    });

    it('should return 400 if experiment_id is missing', async () => {
        const response = await request(app)
          .delete('/api/experiment/delete-by-experiment-id')
          .send({}); 
    
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('experiment_id is required');
      });
    
      it('should return 500 if an error occurs during deletion', async () => {
        ExperimentModel.destroy.mockRejectedValue(new Error('Database error'));
    
        const response = await request(app)
          .delete('/api/experiment/delete-by-experiment-id')
          .send({ experiment_id: '1234' });
    
        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Internal server error');
      });

    it('should return 404 if experiment not found for deletion', async () => {
      ExperimentModel.destroy.mockResolvedValue(0); 

      const response = await request(app)
        .delete('/api/experiment/delete-by-experiment-id')
        .send({ experiment_id: '9999' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Experiment not found');
    });
  });

  describe('DELETE /api/experiments', () => {
    it('should delete all experiments for a user', async () => {
      ExperimentModel.destroy.mockResolvedValue(1); 

      const response = await request(app)
        .delete('/api/experiments/delete-by-user-mail')
        .send({ user_email: 'testuser@example.com' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('All experiments for the user deleted successfully');
    });

    it('should return 400 if user_email is missing', async () => {
        const response = await request(app)
          .delete('/api/experiments/delete-by-user-mail')
          .send({});
    
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('user_email is required');
      });
    
      it('should return 500 if an error occurs during deletion', async () => {
        ExperimentModel.destroy.mockRejectedValue(new Error('Database error'));
    
        const response = await request(app)
          .delete('/api/experiments/delete-by-user-mail')
          .send({ user_email: 'testuser@example.com' });
    
        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Internal server error');
      });

    it('should return 404 if no experiments found for user', async () => {
      ExperimentModel.destroy.mockResolvedValue(0); 

      const response = await request(app)
        .delete('/api/experiments/delete-by-user-mail')
        .send({ user_email: 'nonexistent@example.com' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('No experiments found for the user');
    });
  });
});
