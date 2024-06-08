import { toSnakeCase } from '../../utils/utils.js';

export default async function clubInfoRoutes(app) {
  app.addHook('preValidation', app.authenticate);

  app.post('/club-info',
    {
      schema: {
	body: {
	  type: 'object',
	  properties: {
	    clubName: { type: 'string', nullable: false, maxLength: 60 },
	    address: { type: 'string', nullable: false, maxLength: 40  },
	    email: { type: 'string', nullable: false, maxLength: 255 },
	    description: { type: 'string', nullable: false, maxLength: 1000 },
	    phoneNumber: { type: 'string', nullable: false, maxLength: 25 },
	    contactType: { type: 'string', enum: ['Landline', 'Mobile'] },
	  },
	  required: ['clubName', 'address', 'email', 'description', 'phoneNumber', 'contactType'],
	},
      },
    },
    async(req, res) => {
      const { clubName, address, email, description, phoneNumber, contactType } = req.body;

      try {
	const insertClub = await app.pg.query(`
        INSERT INTO club_info (club_name, address, email, description, phone_number, contact_type)
        VALUES($1, $2, $3, $4, $5, $6) RETURNING id`,
	  [clubName, address, email, description, phoneNumber, contactType]
	);
	return { id: insertClub.rows[0].id };
      } catch(error) {
	res.code(error.statusCode || 500);
	req.log.error(error);
	return { msg: 'Could not add club' };
      }
    });

  app.get('/club-info/:id', {
    schema: {
      params: {
	type: 'object',
	properties: {
	  id: { type: 'string' },
	},
	required: ['id'],
      },
    },
  },
    async(req, res) => {
      try {
	const { id } = req.params;
	const club = await app.pg.query('SELECT * FROM club_info WHERE id = $1', [id]);
	if(club.rows.length === 0) {
	  return res.code(404).send({ message: 'Club not found' });
	}
	return club.rows[0];
      } catch(error) {
	res.code(error.statusCode || 500);
	req.log.error(error);
	return { msg: 'Could not fetch club info' };
      }
    });

  app.patch('/club-info/:id',
    async(req, res) => {
      const { id } = req.params;
      const bodyData = req.body;

      try {
	const club = await app.pg.query('SELECT * FROM club_info WHERE id = $1', [id]);
	if(club.rows.length === 0) {
	  return res.code(404).send({ message: 'Club not found' });
	}
	if(Object.keys(bodyData).length == 0) {
	  return res.code(404).send({ message: 'No fields provided' });
	}

	const setClause = Object.keys(bodyData).map((key, index) => `${toSnakeCase(key)} = $${index + 1}`).join(', ');

	const sql = `UPDATE club_info SET ${setClause} WHERE id = $${Object.keys(bodyData).length + 1}`;
	const values = [...Object.values(bodyData), id];

	await app.pg.query(sql, values);

	res.code(200).send();

      } catch(error) {
	res.code(error.statusCode || 500);
	req.log.error(error);
	return { msg: 'Could not fetch club' };
      }
    });

  app.delete('/club-info/:id', async (req, res) => {
    const { id } = req.params;

    try {
      if (!id) {
        return res.code(400).send({ message: 'ID is required' });
      }

      const result = await app.pg.query(`DELETE FROM club_info WHERE id = $1 RETURNING *`, [id]);

      if (result.rows.length > 0) {
        res.code(204).send();
      } else {
        res.code(404).send();
      }
    } catch(error) {
      res.code(error.statusCode || 500).send({ message: 'Could not delete club' });
      req.log.error(error);
    }
  });
}
